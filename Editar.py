from flask import Flask, render_template, request, redirect, url_for
from bd import obtener_conexion
from pymysql.cursors import DictCursor
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/")
def home():
    # Redirige al perfil del usuario con ID 1 por defecto
    return redirect(url_for("perfil", id_usuario=1))

@app.route("/perfil/<int:id_usuario>", methods=["GET", "POST"])
def perfil(id_usuario):
    conexion = obtener_conexion()
    cursor = conexion.cursor(DictCursor)

    if request.method == "POST":
        # Obtener datos del formulario
        talla = request.form["talla"]
        contrasena = request.form["contrasena"]
        foto_file = request.files.get("foto")

        # Guardar la foto si se sube una nueva
        if foto_file and foto_file.filename != "":
            filename = secure_filename(foto_file.filename)
            ruta_foto = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            foto_file.save(ruta_foto)
            ruta_foto_db = ruta_foto
        else:
            # Mantener la foto actual si no se sube una nueva
            cursor.execute("SELECT foto FROM usuario WHERE id_usuario=%s", (id_usuario,))
            fila = cursor.fetchone()
            ruta_foto_db = fila["foto"]

        # Llamar al procedimiento almacenado para actualizar el perfil
        cursor.callproc("actualizar_perfil", (id_usuario, talla, ruta_foto_db, contrasena))
        conexion.commit()
        return redirect(url_for("perfil", id_usuario=id_usuario))

    # Obtener datos del usuario desde la vista
    cursor.execute("""
        SELECT * FROM vista_perfil_completo_usuario
        WHERE id_usuario = %s
        ORDER BY fecha_publicacion DESC
    """, (id_usuario,))
    filas = cursor.fetchall()
    cursor.close()
    conexion.close()

    if not filas:
        return "Usuario no encontrado", 404

    usuario = {
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

    return render_template("Editar.html", usuario=usuario)

if __name__ == "__main__":
    app.run(debug=True)
