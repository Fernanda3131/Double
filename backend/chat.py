from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
from datetime import datetime
from backend.bd import obtener_conexion 
from backend.mongodb import client      

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Colección de mensajes en MongoDB
mensajes = client["chatdb"]["mensajes"]

# ================== LOGIN ==================
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    conn = obtener_conexion()  
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id_usuario, nombre FROM usuario WHERE email=%s AND password=%s",
        (email, password)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({"msg": "Login exitoso", "id_usuario": user[0], "nombre": user[1]}), 200
    else:
        return jsonify({"msg": "Credenciales inválidas"}), 401

# ================== WEBSOCKETS ==================
@socketio.on("join")
def handle_join(data):
    sala = f"{data['id_emisor']}-{data['id_receptor']}"
    join_room(sala)
    emit("status", {"msg": f"Usuario entró al chat {sala}"}, room=sala)

@socketio.on("mensaje")
def handle_mensaje(data):
    nuevo = {
        "id_emisor": data["id_emisor"],
        "id_receptor": data["id_receptor"],
        "contenido": data["contenido"],
        "fecha_envio": datetime.utcnow()
    }
    mensajes.insert_one(nuevo)  

    sala = f"{data['id_emisor']}-{data['id_receptor']}"
    emit("mensaje", nuevo, room=sala)

# ================== CONSULTAR CONVERSACIÓN ==================
@app.route("/mensajes/<id1>/<id2>", methods=["GET"])
def ver_conversacion(id1, id2):
    data = list(mensajes.find({
        "$or": [
            {"id_emisor": id1, "id_receptor": id2},
            {"id_emisor": id2, "id_receptor": id1}
        ]
    }, {"_id": 0}))
    return jsonify(data)

if __name__ == "__main__":
    socketio.run(app, debug=True)
