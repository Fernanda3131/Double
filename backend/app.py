from flask import Flask
from flask_cors import CORS
import os

# Crear la app Flask
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Configuración de sesión y cookies
app.secret_key = "clave_secreta_super_segura"

# Para desarrollo local sin HTTPS, usa estas configuraciones:
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"    # 'None' requiere secure=True y HTTPS
app.config["SESSION_COOKIE_SECURE"] = False      # True solo con HTTPS

# Carpeta para uploads (asegurar absoluta o relativa correcta)
UPLOAD_FOLDER = os.path.join(os.getcwd(), "static", "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Crear carpeta uploads si no existe
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Importar y registrar Blueprints
from perfiles import perfiles_bp
from login import login_bp
from detalle_prenda import detalle_prenda_bp
from agregar_publicacion import agregar_publicacion_bp
from admin_home import admin_home_bp
from mi_perfil import mi_perfil_bp
from Editar import editar_perfil_bp  
from gestion_prendas import gestion_prendas_bp

# Registrar blueprints
app.register_blueprint(perfiles_bp)
app.register_blueprint(login_bp)
app.register_blueprint(detalle_prenda_bp)
app.register_blueprint(agregar_publicacion_bp)
app.register_blueprint(admin_home_bp)
app.register_blueprint(mi_perfil_bp)
app.register_blueprint(editar_perfil_bp)
app.register_blueprint(gestion_prendas_bp)

# Ejecutar la app
if __name__ == "__main__":
    app.run(debug=True, port=5000)