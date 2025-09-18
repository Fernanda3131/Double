import os
import pymysql
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
app.secret_key = os.environ.get("SECRET_KEY", "clave_secreta_super_segura")

# ----------------------------
# Ruta para archivos subidos
# ----------------------------
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ----------------------------
# Conexión a la base de datos
# ----------------------------
def obtener_conexion_dict():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="Double_P",
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )

# ----------------------------
# Obtener publicaciones desde la vista
# ----------------------------
def obtener_catalogo():
    conexion = obtener_conexion_dict()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT * FROM vista_publicaciones")
            publicaciones = cursor.fetchall()
            return publicaciones
    finally:
        conexion.close()

# ----------------------------
# API para publicaciones
# ----------------------------
@app.route("/api/publicaciones", methods=["GET"])
def api_publicaciones():
    publicaciones = obtener_catalogo()
    return jsonify(publicaciones)

# ----------------------------
# Ejecutar servidor
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
