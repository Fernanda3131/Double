from flask import Flask, request, jsonify
from bd import obtener_conexion

app = Flask(__name__, template_folder='templates')


# ============================
# Funciones auxiliares
# ============================
def existe_email(email):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM usuario WHERE email = %s", (email,))
            resultado = cursor.fetchone()
            return resultado[0] > 0  # True si ya existe
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
@app.route("/")



@app.route("/register", methods=["POST"])
def registrar_usuario():
    try:
        nombre = request.form.get("nombre")
        username = request.form.get("username")
        email = request.form.get("email")
        contrasena = request.form.get("contrasena")
        talla = request.form.get("talla")
        fecha_nacimiento = request.form.get("fecha_nacimiento")

        foto = request.files.get("foto")
        foto_nombre = foto.filename if foto and foto.filename != "" else None

        id_rol = 2  # Usuario normal

        # 🚨 Validar si el correo ya existe
        if existe_email(email):
            return jsonify({"success": False, "mensaje": "⚠️ Este correo ya está registrado."}), 400

        # Insertar usuario
        if registrar(nombre, username, email, contrasena, talla, fecha_nacimiento, foto_nombre, id_rol):
            return jsonify({"success": True, "mensaje": "✅ Registro exitoso."}), 201
        else:
            return jsonify({"success": False, "mensaje": "❌ Error al registrar. Intenta de nuevo."}), 500

    except Exception as e:
        print("⚠️ Error inesperado:", e)
        return jsonify({"success": False, "mensaje": "⚠️ Error inesperado en el servidor."}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)