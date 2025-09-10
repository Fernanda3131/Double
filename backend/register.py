from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.bd import obtener_conexion
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)  # Ya no necesitas template_folder
CORS(app, supports_credentials=True)

# ============================
# Configuración de uploads
# ============================
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ============================
# Funciones auxiliares
# ============================
def existe_email(email):
    conexion = obtener_conexion()
    print("Conexión a BD exitosa")
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM usuario WHERE email = %s", (email,))
            resultado = cursor.fetchone()
            return resultado[0] > 0
    finally:
        conexion.close()

def registrar(nombre, username, email, contrasena, talla, fecha_nacimiento, foto, id_rol):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO usuario (nombre, username, email, contrasena, talla, fecha_nacimiento, foto, id_rol)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (nombre, username, email, contrasena, talla, fecha_nacimiento, foto, id_rol)
            )
        conexion.commit()
        return True
    except Exception as e:
        print("❌ Error al registrar:", e)
        conexion.rollback()
        return False
    finally:
        conexion.close()

# ============================
# Rutas
# ============================
@app.route("/register", methods=["POST"])
def registrar_usuario():
    try:
        print("===== Datos recibidos =====")
        print("Form data:", request.form)
        print("Files:", request.files)

        nombre = request.form.get("nombre")
        username = request.form.get("username")
        email = request.form.get("email")
        contrasena = request.form.get("contrasena")
        talla = request.form.get("talla")
        fecha_nacimiento = request.form.get("fecha_nacimiento")
        id_rol = 2

        foto = request.files.get("foto")
        foto_nombre = "default.jpg"
        if foto and allowed_file(foto.filename):
            foto_nombre = secure_filename(foto.filename)
            foto.save(os.path.join(app.config["UPLOAD_FOLDER"], foto_nombre))
            print(f"✅ Foto guardada: {foto_nombre}")

        if existe_email(email):
            print(f"⚠️ Email ya registrado: {email}")
            return jsonify({"success": False, "mensaje": "⚠️ Este correo ya está registrado."}), 400

        exito = registrar(nombre, username, email, contrasena, talla, fecha_nacimiento, foto_nombre, id_rol)
        if exito:
            print("✅ Registro exitoso en la BD")
            return jsonify({"success": True, "mensaje": "✅ Registro exitoso."}), 201
        else:
            print("❌ Falló el registro en la BD")
            return jsonify({"success": False, "mensaje": "❌ Error al registrar. Intenta de nuevo."}), 500

    except Exception as e:
        print("⚠️ Error inesperado:", e)
        return jsonify({"success": False, "mensaje": f"⚠️ Error inesperado en el servidor: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
