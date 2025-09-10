from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "clave_secreta_super_segura"

# Importa tus rutas después de crear la app
from backend.register import *
from backend.perfiles import *
from backend.login import *

if __name__ == "__main__":
    app.run(debug=True, port=5000)
