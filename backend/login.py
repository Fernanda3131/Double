from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.bd import obtener_conexion

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "clave_secreta_super_segura"

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                "SELECT id, username, email, contrasena FROM usuario WHERE username=%s OR email=%s",
                (username, username)
            )
            usuario = cursor.fetchone()

        if usuario:
            id_usuario, db_username, db_email, db_password = usuario
            if password == db_password:
                token = "token_de_prueba"  # luego puedes reemplazar por JWT
                return jsonify({"success": True, "token": token}), 200
            else:
                return jsonify({"success": False, "mensaje": "Contraseña incorrecta"}), 401
        else:
            return jsonify({"success": False, "mensaje": "Usuario no encontrado"}), 404

    except Exception as e:
        print("❌ Error login:", e)
        return jsonify({"success": False, "mensaje": "Error en el servidor"}), 500
    finally:
        if 'conexion' in locals():
            conexion.close()

if __name__ == "__main__":
    app.run(debug=True, port=5000)

