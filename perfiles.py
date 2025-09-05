from flask import Flask, request, session, jsonify, send_from_directory
from bd import obtener_conexion
import os 

app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
app.secret_key = "2025" 

# ============================
# CONFIG
# ============================
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")  # Carpeta absoluta para imágenes

# ============================
# FUNCIONES BD
# ============================

def otros_perfil(id_usuario):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:  
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
            # Convertir a lista de diccionarios
            columnas = [desc[0] for desc in cursor.description]  # nombres de columnas
            perfil = [dict(zip(columnas, fila)) for fila in filas]
            return perfil
    finally:
        conexion.close()


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


# ============================
# RUTAS API
# ============================

@app.route("/api/perfiles", methods=["GET"])
def ver_otros_perfiles():
    id_usuario = session.get("id_usuario", 1)  # Simulación de sesión
    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401

    datos_perfil = otros_perfil(id_usuario)
    return jsonify({"perfil": datos_perfil})


@app.route("/api/guardar_valoracion", methods=["POST"])
def guardar_valoracion():
    data = request.get_json()
    usuario_valorado_id = data.get("usuario_valorado_id")
    puntaje = data.get("puntaje")

    if not usuario_valorado_id or not puntaje:
        return jsonify({"error": "Datos incompletos"}), 400

    insertar_valoracion(usuario_valorado_id, puntaje)
    return jsonify({"mensaje": "Valoración guardada con éxito"})


# ============================
# RUTA ARCHIVOS UPLOADS
# ============================

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ============================
# RUTA REACT
# ============================

@app.route("/")
def index():
    return app.send_static_file("index.html")


# ============================
# MAIN
# ============================

if __name__ == "__main__":
    app.run(debug=True, port=5000)