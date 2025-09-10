from flask import Flask, request, session, jsonify
from backend.bd import obtener_conexion
from pymysql.cursors import DictCursor
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Para que React pueda enviar cookies/sesión

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Necesario para manejar sesión
app.secret_key = os.environ.get("SECRET_KEY", "clave_secreta_super_segura")


@app.route("/api/perfil", methods=["GET", "POST"])
def perfil():
    id_usuario = session.get("id_usuario")

    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401

    conexion = obtener_conexion()
    cursor = conexion.cursor(DictCursor)

    if request.method == "POST":
        # React enviará datos en form-data (para la foto)
        talla = request.form.get("talla")
        contrasena = request.form.get("contrasena")
        foto_file = request.files.get("foto")

        # Guardar la foto si se sube una nueva
        if foto_file and foto_file.filename != "":
            filename = secure_filename(foto_file.filename)
            ruta_foto = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            foto_file.save(ruta_foto)
            ruta_foto_db = ruta_foto
        else:
            # Mantener la foto actual si no se sube nueva
            cursor.execute("SELECT foto FROM usuario WHERE id_usuario=%s", (id_usuario,))
            fila = cursor.fetchone()
            ruta_foto_db = fila["foto"]

        # Llamar al procedimiento almacenado para actualizar el perfil
        cursor.callproc("actualizar_perfil", (id_usuario, talla, ruta_foto_db, contrasena))
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({"mensaje": "Perfil actualizado con éxito"}), 200

    # GET -> devolver perfil
    cursor.execute("""
        SELECT * FROM vista_perfil_completo_usuario
        WHERE id_usuario = %s
        ORDER BY fecha_publicacion DESC
    """, (id_usuario,))
    filas = cursor.fetchall()
    cursor.close()
    conexion.close()

    if not filas:
        return jsonify({"error": "Usuario no encontrado"}), 404

    usuario = {
        "id_usuario": id_usuario,
        "nombre": filas[0]["nombre"],
        "user_name": filas[0]["user_name"],
        "correo": filas[0]["email"],
        "talla": filas[0]["talla"],
        "fecha_nacimiento": filas[0]["fecha_nacimiento"],
        "foto": "/" + filas[0]["foto"] if filas[0]["foto"] else None,
        "estrellas": filas[0]["puntaje"] or 0,
        "publicaciones": []
    }

    for fila in filas:
        if fila["id_publicacion"]:
            usuario["publicaciones"].append({
                "descripcion": fila["descripcion_publicacion"],
                "tipo": fila["tipo_publicacion"],
                "fecha": fila["fecha_publicacion"]
            })

    return jsonify(usuario)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
