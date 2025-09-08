# login.py
from flask import Flask, request, session, jsonify
from bd import obtener_conexion
from pymysql.cursors import DictCursor
import os, json

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/api/iniciar', methods=['POST'])
def iniciar_sesion():
    data = request.get_json()
    usuario = data.get("username")
    contrasena = data.get("password")

    if not usuario or not contrasena:
        return jsonify({"error": "Datos faltantes"}), 400

    conexion = obtener_conexion()
    cursor = conexion.cursor(DictCursor)
    cursor.execute(
        """SELECT id_usuario FROM usuario 
           WHERE (email = %s OR username = %s) AND contrasena = %s""",
        (usuario, usuario, contrasena)
    )
    account = cursor.fetchone()
    cursor.close()
    conexion.close()

    if account:
        session["logueado"] = True
        session["id_usuario"] = account["id_usuario"]
        return jsonify({"mensaje": "OK", "id_usuario": account["id_usuario"]}), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401

if __name__ == "__main__":
    app.run(debug=True)
