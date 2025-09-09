from flask import Flask, request, session, jsonify, send_from_directory
from bd import obtener_conexion
from flask_cors import CORS
<<<<<<< HEAD
import os 

app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
CORS(app)
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")  
=======
import os

app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

# Necesario para manejar sesiones (igual que en login.py)
app.secret_key = os.environ.get("SECRET_KEY", "clave_secreta_super_segura")

>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))

def otros_perfil(id_usuario):
    conexion = obtener_conexion()
    try:
<<<<<<< HEAD
        with conexion.cursor() as cursor:  
=======
        with conexion.cursor() as cursor:
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
            cursor.execute(
                """
                SELECT 
                    id_usuario,
                    username_usuario,
                    foto_usuario,
                    id_publicacion,
                    id_prenda,
                    nombre_prenda,
                    foto_prenda,
                    promedio_valoracion
                FROM vista_otros_perfiles
                WHERE id_usuario = %s
                """,
                (id_usuario,)
            )
            filas = cursor.fetchall()
<<<<<<< HEAD
            columnas = [desc[0] for desc in cursor.description]  
=======
            columnas = [desc[0] for desc in cursor.description]
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
            perfil = [dict(zip(columnas, fila)) for fila in filas]
            return perfil
    finally:
        conexion.close()

<<<<<<< HEAD
def ef_valoracion_usuario(id_usuario):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:  
=======

def ef_valoracion_usuario(id_usuario):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
            cursor.execute(
                """
                SELECT 
                    u.id_usuario,
                    u.nombre AS nombre_usuario,
                    AVG(v.puntaje) AS promedio_valoracion
                FROM usuario u
                LEFT JOIN valoracion v 
                       ON u.id_usuario = v.usuario_valorado_id
                WHERE u.id_usuario = %s
                GROUP BY u.id_usuario, u.nombre;
                """,
                (id_usuario,)
            )
            filas = cursor.fetchall()
<<<<<<< HEAD
            columnas = [desc[0] for desc in cursor.description] 
=======
            columnas = [desc[0] for desc in cursor.description]
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
            resultado = [dict(zip(columnas, fila)) for fila in filas]
            return resultado
    finally:
        conexion.close()

<<<<<<< HEAD
=======

>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
def insertar_valoracion(usuario_valorado_id, puntaje):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO valoracion (usuario_valorado_id, puntaje) 
                VALUES (%s, %s)
                """,
                (usuario_valorado_id, puntaje)
            )
        conexion.commit()
    finally:
        conexion.close()

<<<<<<< HEAD
@app.route("/api/perfiles", methods=["GET"])
def ver_otros_perfiles():
    id_usuario = session.get("id_usuario", 1)  # Simulación sesión
=======

@app.route("/api/perfiles", methods=["GET"])
def ver_otros_perfiles():
    # 👉 Ahora usamos la sesión real, no un id fijo
    id_usuario = session.get("id_usuario")
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))

    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401

    datos_perfil = otros_perfil(id_usuario)
    promedio = ef_valoracion_usuario(id_usuario)

    # Promedio puede venir vacío si no hay valoraciones
    promedio_valoracion = promedio[0]['promedio_valoracion'] if promedio else 0

<<<<<<< HEAD
    # Si datos_perfil está vacío, construyo un perfil básico para no romper frontend
=======
    # Si no hay datos, mando un perfil básico
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
    if not datos_perfil:
        perfil = {
            "id_usuario": id_usuario,
            "username_usuario": "Usuario Ejemplo",
            "foto_usuario": "default.jpg",
            "promedio_valoracion": promedio_valoracion,
            "prendas": []
        }
    else:
<<<<<<< HEAD
        # Agregar/actualizar promedio_valoracion en cada item (si hay múltiples)
=======
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
        for p in datos_perfil:
            p['promedio_valoracion'] = promedio_valoracion
        perfil = datos_perfil

    return jsonify({"perfil": perfil})

<<<<<<< HEAD
=======

>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
@app.route("/api/guardar_valoracion", methods=["POST"])
def guardar_valoracion():
    data = request.get_json()
    usuario_valorado_id = data.get("usuario_valorado_id")
    puntaje = data.get("puntaje")

    if not usuario_valorado_id or not puntaje:
        return jsonify({"error": "Datos incompletos"}), 400

    insertar_valoracion(usuario_valorado_id, puntaje)
    return jsonify({"mensaje": "Valoración guardada con éxito"})

<<<<<<< HEAD
=======

>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

<<<<<<< HEAD
=======

>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
@app.route("/")
def index():
    return app.send_static_file("index.html")

<<<<<<< HEAD
=======

>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
if __name__ == "__main__":
    app.run(debug=True, port=5000)
