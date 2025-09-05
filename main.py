from flask import Flask, render_template, request, redirect, session, url_for
import os, json
from flask_dance.contrib.google import make_google_blueprint, google
from bd import obtener_conexion
from pymysql.cursors import DictCursor
import controlador_almacenado
from register import register_bp   # Importamos el blueprint de registro

# ============================
# Configuración
# ============================
app = Flask(__name__)
app.secret_key = "FFCD"
app.register_blueprint(register_bp)  # Usamos el módulo register

# ============================
# Configuración Google OAuth
# ============================
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

with open("client_secret.json") as f:
    google_config = json.load(f)

google_bp = make_google_blueprint(
    client_id=google_config["web"]["client_id"],
    client_secret=google_config["web"]["client_secret"],
    scope=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid"
    ],
    redirect_to="google_login"
)
app.register_blueprint(google_bp, url_prefix="/login")

# ============================
# Login con Google
# ============================
@app.route('/google-login')
def google_login():
    if not google.authorized:
        return redirect(url_for("google.login"))

    resp = google.get("/oauth2/v2/userinfo")
    if resp.ok:
        user_info = resp.json()
        session["logueado"] = True
        session["usuario_google"] = user_info
        return render_template("admin.html")
    return redirect(url_for('login'))

# ============================
# Logout
# ============================
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ============================
# Login manual
# ============================
@app.route('/login-acceso', methods=['POST'])
def login_acceso():
    if 'username' in request.form and 'password' in request.form:
        usuario = request.form['username']
        contrasena = request.form['password']

        conexion = obtener_conexion()
        cursor = conexion.cursor(DictCursor)
        cursor.execute("""
            SELECT * FROM usuario 
            WHERE (email = %s OR username = %s) AND contrasena = %s
        """, (usuario, usuario, contrasena))
        account = cursor.fetchone()
        cursor.close()
        conexion.close()

        if account:
            session['logueado'] = True
            session['id_usuario'] = account['id_usuario']
            return render_template("admin.html")
        else:
            return render_template('login.html', mensaje="Credenciales incorrectas")
    return redirect(url_for('login'))

# ============================
# Rutas principales
# ============================
@app.route("/guardado")
def mensaje_guardado():
    return render_template("guardado.html")

@app.route("/login")
def login():
    return render_template("login.html")

# ============================
# CRUDs
# ============================
@app.route("/agregar_publicacion")
def formulario_agregar_publicacion():
    return render_template("agregar_publicacion.html")

@app.route("/guardar_publicacion", methods=["POST"])
def guardar_publicacion():
    descripcion = request.form["descripcion"]
    estado = request.form["estado"]
    tipo_publicacion = request.form["tipo"]
    fecha_publicacion = request.form["fecha"]
    id_usuario = session.get("id_usuario", 1)
    controlador_almacenado.insertar_publicacion(descripcion, estado, tipo_publicacion, fecha_publicacion, id_usuario)
    return redirect("/guardado")

# ... aquí van todos los demás CRUDs (prenda, mensaje, rol, usuario, pago, valoración)

if __name__ == "__main__":
    app.run(debug=True)
