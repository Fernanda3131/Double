from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from bd import obtener_conexion
import os
import time

# Blueprint
gestion_prendas_bp = Blueprint('gestion_prendas', __name__)

# ------------------ 📂 Configuración de subida ------------------
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamped = f"{int(time.time())}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, timestamped)
        file.save(filepath)
        return timestamped
    return None


# ------------------ 🔍 OBTENER DETALLE ------------------
def obtener_detalle_prenda(id_prenda):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            sql = '''
                SELECT 
                    p.id_prenda,
                    p.nombre AS nombre_prenda,
                    u.username,
                    u.id_usuario,
                    pub.id_publicacion,      -- ✅ Para editar/eliminar
                    pub.descripcion AS descripcion_prenda,
                    p.talla,
                    p.foto,
                    p.foto2,
                    p.foto3,
                    p.foto4,
                    p.valor,
                    pub.tipo_publicacion,
                    pub.estado,
                    pub.fecha_publicacion
                FROM prenda p
                INNER JOIN publicacion pub ON p.id_publicacion = pub.id_publicacion
                INNER JOIN usuario u ON pub.id_usuario = u.id_usuario
                WHERE p.id_prenda = %s
            '''
            cursor.execute(sql, (id_prenda,))
            fila = cursor.fetchone()
            if fila:
                columnas = [desc[0] for desc in cursor.description]
                return dict(zip(columnas, fila))
            return None
    finally:
        conexion.close()


@gestion_prendas_bp.route("/api/detalle_prenda/<int:id_prenda>", methods=["GET"])
def api_detalle_prenda(id_prenda):
    try:
        prenda = obtener_detalle_prenda(id_prenda)
        if not prenda:
            return jsonify({"prenda": None}), 200
        return jsonify({"prenda": prenda}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ------------------ ✏ EDITAR ------------------
def editar_publicacion_prenda(
    id_publicacion, descripcion, estado, tipo_publicacion, fecha_publicacion,
    nombre, descripcion_prenda, talla, foto, foto2, foto3, foto4, valor
):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.callproc("editar_publicacion_prenda", (
                id_publicacion,
                descripcion,
                estado,
                tipo_publicacion,
                fecha_publicacion,
                nombre,
                descripcion_prenda,
                talla,
                foto,
                foto2,
                foto3,
                foto4,
                valor
            ))
            conexion.commit()
    finally:
        conexion.close()


@gestion_prendas_bp.route("/editar/<int:id_publicacion>", methods=["POST"])
def editar_publicacion(id_publicacion):
    try:
        # Campos del formulario
        descripcion = request.form.get("descripcion")
        estado = request.form.get("estado")
        tipo_publicacion = request.form.get("tipo_publicacion")
        fecha_publicacion = request.form.get("fecha_publicacion")
        nombre = request.form.get("nombre")
        descripcion_prenda = request.form.get("descripcion_prenda")
        talla = request.form.get("talla")
        valor = request.form.get("valor")

        if not all([descripcion, estado, tipo_publicacion, nombre, valor]):
            return jsonify({"status": "error", "message": "Faltan campos obligatorios"}), 400

        # Procesar fotos (hasta 4)
        fotos_guardadas = []
        for i in range(1, 5):
            key = f"foto{i if i > 1 else ''}"
            file = request.files.get(key)
            if file and allowed_file(file.filename):
                filename = save_file(file)
                fotos_guardadas.append(filename)
            else:
                actual = request.form.get(f"{key}_actual")
                fotos_guardadas.append(actual if actual else None)

        editar_publicacion_prenda(
            id_publicacion, descripcion, estado, tipo_publicacion, fecha_publicacion,
            nombre, descripcion_prenda, talla,
            fotos_guardadas[0], fotos_guardadas[1], fotos_guardadas[2], fotos_guardadas[3],
            valor
        )

        return jsonify({"status": "success", "message": "Publicación editada correctamente"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ------------------ 🗑 ELIMINAR ------------------
def eliminar_publicacion_prenda(id_publicacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.callproc("eliminar_publicacion_prenda", (id_publicacion,))
            conexion.commit()
    finally:
        conexion.close()


@gestion_prendas_bp.route("/eliminar/<int:id_publicacion>", methods=["DELETE"])
def eliminar_publicacion(id_publicacion):
    try:
        eliminar_publicacion_prenda(id_publicacion)
        return jsonify({"status": "success", "message": "Publicación eliminada correctamente"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ------------------ 📦 SERVIR IMÁGENES ------------------
@gestion_prendas_bp.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
