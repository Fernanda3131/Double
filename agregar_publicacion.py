<<<<<<< HEAD
from flask import Flask, request, session, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from bd import obtener_conexion
import os

# ===================== CONFIG =====================
app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # crea carpeta si no existe
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ===================== DB FUNC =====================
def crear_publicacion_prenda(
    descripcion, estado, tipo_publicacion, fecha_publicacion,
    id_usuario, nombre, descripcion_prenda, talla,
    foto, foto2, foto3, foto4, valor
):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.callproc("crear_publicacion_prenda", (
                descripcion,
                estado,
                tipo_publicacion,
                fecha_publicacion,
                id_usuario,
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


# ===================== API =====================
@app.route("/publicar", methods=["POST"])
def publicar():
    id_usuario = session.get("id_usuario", 1)  # usuario de prueba

    # datos de texto
    descripcion = request.form.get("descripcion")
    estado = request.form.get("estado")
    tipo_publicacion = request.form.get("tipo_publicacion")
    fecha_publicacion = request.form.get("fecha_publicacion")
    nombre = request.form.get("nombre")
    descripcion_prenda = request.form.get("descripcion_prenda")
    talla = request.form.get("talla")
    valor = request.form.get("valor")

    # fotos
    fotos_guardadas = []
    for key in ["foto", "foto2", "foto3", "foto4"]:
        file = request.files.get(key)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)
            fotos_guardadas.append(filename)
        else:
            fotos_guardadas.append(None)

    try:
        crear_publicacion_prenda(
            descripcion, estado, tipo_publicacion, fecha_publicacion,
            id_usuario, nombre, descripcion_prenda, talla,
            fotos_guardadas[0], fotos_guardadas[1], fotos_guardadas[2], fotos_guardadas[3],
            valor
        )
        return jsonify({"status": "success", "message": "Publicación creada exitosamente 💅"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ===================== SERVIR FOTOS =====================
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


if __name__ == "__main__":
    app.run(debug=True)
=======
from flask import Flask, request, session, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from bd import obtener_conexion
import os

# ===================== CONFIG =====================
app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # crea carpeta si no existe
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ===================== DB FUNC =====================
def crear_publicacion_prenda(
    descripcion, estado, tipo_publicacion, fecha_publicacion,
    id_usuario, nombre, descripcion_prenda, talla,
    foto, foto2, foto3, foto4, valor
):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.callproc("crear_publicacion_prenda", (
                descripcion,
                estado,
                tipo_publicacion,
                fecha_publicacion,
                id_usuario,
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


# ===================== API =====================
@app.route("/publicar", methods=["POST"])
def publicar():
    id_usuario = session.get("id_usuario", 1)  # usuario de prueba

    # datos de texto
    descripcion = request.form.get("descripcion")
    estado = request.form.get("estado")
    tipo_publicacion = request.form.get("tipo_publicacion")
    fecha_publicacion = request.form.get("fecha_publicacion")
    nombre = request.form.get("nombre")
    descripcion_prenda = request.form.get("descripcion_prenda")
    talla = request.form.get("talla")
    valor = request.form.get("valor")

    # fotos
    fotos_guardadas = []
    for key in ["foto", "foto2", "foto3", "foto4"]:
        file = request.files.get(key)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)
            fotos_guardadas.append(filename)
        else:
            fotos_guardadas.append(None)

    try:
        crear_publicacion_prenda(
            descripcion, estado, tipo_publicacion, fecha_publicacion,
            id_usuario, nombre, descripcion_prenda, talla,
            fotos_guardadas[0], fotos_guardadas[1], fotos_guardadas[2], fotos_guardadas[3],
            valor
        )
        return jsonify({"status": "success", "message": "Publicación creada exitosamente 💅"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ===================== SERVIR FOTOS =====================
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


if __name__ == "__main__":
    app.run(debug=True)
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
