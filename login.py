import os
from flask import Flask, render_template, redirect, request, session, url_for
from flask_dance.contrib.google import make_google_blueprint, google
from bd import obtener_conexion
from pymysql.cursors import DictCursor
import json


os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__, template_folder='templates')
app.secret_key = "FFCD"


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


@app.route('/')
def home():
    return render_template('login.html')


@app.route('/admin')
def admin():
    if "logueado" in session or google.authorized:
        return render_template('admin.html')
    return redirect(url_for('home'))

# Login manual
@app.route('/login-acceso', methods=['POST'])
def login():
    if 'username' in request.form and 'password' in request.form:
        usuario = request.form['username']
        contrasena = request.form['password']

        conexion = obtener_conexion()
        cursor = conexion.cursor(DictCursor)
        cursor.execute("""
            SELECT * FROM usuario 
            WHERE (email = %s OR user_name = %s) AND contraseña = %s
        """, (usuario, usuario, contrasena))
        account = cursor.fetchone()
        cursor.close()
        conexion.close()

        if account:
            session['logueado'] = True
            session['id_usuario'] = account['id_usuario']
            return redirect(url_for('admin'))
        else:
            return render_template('login.html', mensaje="Credenciales incorrectas")
    return redirect(url_for('home'))

# Login con Google
@app.route('/google-login')
def google_login():
    if not google.authorized:
        return redirect(url_for("google.login"))
    
    resp = google.get("/oauth2/v2/userinfo")
    if resp.ok:
        user_info = resp.json()
        session["logueado"] = True
        session["usuario_google"] = user_info
        return redirect(url_for("admin"))

    return redirect(url_for('home'))

# Cerrar sesión
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.run(debug=True)
