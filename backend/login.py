from flask import Blueprint, request, jsonify, session, send_from_directory
from bd import obtener_conexion
from pymysql.cursors import DictCursor
import os
from werkzeug.utils import secure_filename
import bcrypt
from datetime import datetime, timedelta

login_bp = Blueprint('login', __name__)

# Diccionario para llevar el control de intentos
login_intentos = {}  
MAX_INTENTOS = 5
BLOQUEO_MINUTOS = 1

# ============================
# Configuración de uploads
# ============================
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ============================
# Funciones de bloqueo
# ============================
def esta_bloqueado(usuario):
    info = login_intentos.get(usuario)
    if info and "bloqueo_hasta" in info:
        now = datetime.now()
        if now < info["bloqueo_hasta"]:
            # Devuelve segundos restantes
            return (True, int((info["bloqueo_hasta"] - now).total_seconds()))
    return (False, 0)

def registrar_intento(usuario):
    info = login_intentos.get(usuario, {"intentos": 0})
    info["intentos"] += 1
    if info["intentos"] >= MAX_INTENTOS:
        info["bloqueo_hasta"] = datetime.now() + timedelta(minutes=BLOQUEO_MINUTOS)
        info["intentos"] = 0  # reset después de bloquear
    login_intentos[usuario] = info

# ============================
# Ruta de login
# ============================
@login_bp.route('/iniciar', methods=['POST', 'OPTIONS'])
def iniciar_sesion():
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.get_json()
        usuario = data.get("username")
        contrasena = data.get("password")
        if not usuario or not contrasena:
            return jsonify({"error": "Datos faltantes"}), 400

        bloqueado, segundos_restantes = esta_bloqueado(usuario)
        if bloqueado:
            return jsonify({
                "error": f"Usuario bloqueado por {BLOQUEO_MINUTOS} minutos",
                "bloqueo_restante": segundos_restantes
            }), 403

        conexion = obtener_conexion()
        cursor = conexion.cursor(DictCursor)
        cursor.execute(
            "SELECT id_usuario, username, email, nombre, foto, contrasena, id_rol FROM usuario "
            "WHERE email=%s OR username=%s",
            (usuario, usuario)
        )
        account = cursor.fetchone()
        cursor.close()
        conexion.close()

        if account and bcrypt.checkpw(contrasena.encode('utf-8'), account['contrasena'].encode('utf-8')):
            session["logueado"] = True
            session["id_usuario"] = account["id_usuario"]
            account.pop('contrasena', None)
            if usuario in login_intentos:
                login_intentos.pop(usuario)  # reset intentos si acierta
            # Asegurarse de que id_rol sea int
            id_rol = account.get('id_rol')
            try:
                id_rol = int(id_rol)
            except Exception:
                id_rol = 2
            return jsonify({"mensaje": "OK", **account, "id_rol": id_rol}), 200
        else:
            registrar_intento(usuario)
            return jsonify({"error": "Credenciales incorrectas"}), 401

    except Exception as e:
        print("❌ Error en login:", e)
        return jsonify({"error": "Error interno del servidor"}), 500

# ============================
# Ruta de registro
# ============================
@login_bp.route('/register', methods=['POST'])
def register():
    try:
        nombre = request.form.get("nombre")
        username = request.form.get("username")
        email = request.form.get("email")
        contrasena = request.form.get("contrasena")
        talla = request.form.get("talla")
        fecha_nacimiento = request.form.get("fecha_nacimiento")
        id_rol = 2

        if not nombre or not username or not email or not contrasena or not fecha_nacimiento or not talla:
            return jsonify({"success": False, "mensaje": "⚠ Faltan datos obligatorios."}), 400

        hashed_contrasena = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        foto = request.files.get("foto")
        if foto and allowed_file(foto.filename):
            foto_nombre = secure_filename(foto.filename)
            foto.save(os.path.join(UPLOAD_FOLDER, foto_nombre))
        else:
            foto_nombre = "default.jpg"

        conexion = obtener_conexion()
        cursor = conexion.cursor(DictCursor)
        cursor.execute("SELECT * FROM usuario WHERE email=%s OR username=%s", (email, username))
        if cursor.fetchone():
            cursor.close()
            conexion.close()
            return jsonify({"success": False, "mensaje": "❌ Usuario o correo ya existe"}), 409

        cursor.execute(
            "INSERT INTO usuario (nombre,email,username,contrasena,fecha_nacimiento,talla,foto,id_rol) "
            "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
            (nombre,email,username,hashed_contrasena,fecha_nacimiento,talla,foto_nombre,id_rol)
        )
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({"success": True, "mensaje": "✅ Usuario registrado con éxito"}), 201

    except Exception as e:
        print("❌ Error en register:", e)
        return jsonify({"success": False, "mensaje": "❌ Error interno del servidor"}), 500

# ============================
# Publicaciones y catálogo
# ============================
@login_bp.route("/api/publicaciones", methods=["GET"])
def api_publicaciones():
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(DictCursor)
        cursor.execute("SELECT * FROM vista_publicaciones")
        publicaciones = cursor.fetchall()
        cursor.close()
        conexion.close()
        return jsonify(publicaciones)
    except Exception as e:
        print("❌ Error al obtener publicaciones:", e)
        return jsonify({"error": "No se pudieron cargar las publicaciones"}), 500
