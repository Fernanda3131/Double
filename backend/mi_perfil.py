from flask import Blueprint, session, jsonify, send_from_directory, current_app
from bd import obtener_conexion  # Tu función para conectar a la DB
import os

mi_perfil_bp = Blueprint('mi_perfil', __name__)

# ------------------------------
# Carpeta para imágenes
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

# ------------------------------
# Función para obtener perfil
# ------------------------------
def obtener_perfil(id_usuario):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    u.id_usuario,
                    u.nombre AS nombre_usuario,
                    u.username AS username_usuario,
                    u.foto AS foto_usuario,
                    p.id_publicacion,
                    pr.id_prenda,
                    pr.nombre AS nombre_prenda,
                    pr.foto AS foto_prenda,
                    vv.promedio_valoracion
                FROM usuario u
                LEFT JOIN publicacion p ON u.id_usuario = p.id_usuario
                LEFT JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
                LEFT JOIN (
                    SELECT 
                        v.usuario_valorado_id,
                        AVG(v.puntaje) AS promedio_valoracion
                    FROM valoracion v
                    GROUP BY v.usuario_valorado_id
                ) vv ON u.id_usuario = vv.usuario_valorado_id
                WHERE u.id_usuario = %s
                """,
                (id_usuario,)
            )
            filas = cursor.fetchall()
            columnas = [desc[0] for desc in cursor.description]
            perfil = [dict(zip(columnas, fila)) for fila in filas]
            if not perfil:
                return None
            # Agrupar datos del usuario y prendas
            usuario = {
                'id_usuario': perfil[0]['id_usuario'],
                'nombre_usuario': perfil[0]['nombre_usuario'],
                'username_usuario': perfil[0]['username_usuario'],
                'foto_usuario': perfil[0]['foto_usuario'],
                'promedio_valoracion': perfil[0]['promedio_valoracion'],
                'prendas': []
            }
            for row in perfil:
                if row['id_prenda'] is not None:
                    prenda = {
                        'id_prenda': row['id_prenda'],
                        'id_publicacion': row['id_publicacion'],
                        'nombre_prenda': row['nombre_prenda'],
                        'foto_prenda': row['foto_prenda'],
                        'promedio_valoracion': row['promedio_valoracion']
                    }
                    usuario['prendas'].append(prenda)
            return usuario
    finally:
        conexion.close()

# ------------------------------
# Carpeta para imágenes
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

# ------------------------------
# Función para obtener perfil
# ------------------------------
def obtener_perfil(id_usuario):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    u.id_usuario,
                    u.nombre AS nombre_usuario,
                    u.username AS username_usuario,
                    u.foto AS foto_usuario,
                    p.id_publicacion,
                    pr.id_prenda,
                    pr.nombre AS nombre_prenda,
                    pr.foto AS foto_prenda,
                    vv.promedio_valoracion
                FROM usuario u
                LEFT JOIN publicacion p ON u.id_usuario = p.id_usuario
                LEFT JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
                LEFT JOIN (
                    SELECT 
                        v.usuario_valorado_id,
                        AVG(v.puntaje) AS promedio_valoracion
                    FROM valoracion v
                    GROUP BY v.usuario_valorado_id
                ) vv ON u.id_usuario = vv.usuario_valorado_id
                WHERE u.id_usuario = %s
                """,
                (id_usuario,)
            )
            filas = cursor.fetchall()
            columnas = [desc[0] for desc in cursor.description]
            perfil = [dict(zip(columnas, fila)) for fila in filas]
            if not perfil:
                return None
            # Agrupar datos del usuario y prendas
            usuario = {
                'id_usuario': perfil[0]['id_usuario'],
                'nombre_usuario': perfil[0]['nombre_usuario'],
                'username_usuario': perfil[0]['username_usuario'],
                'foto_usuario': perfil[0]['foto_usuario'],
                'promedio_valoracion': perfil[0]['promedio_valoracion'],
                'prendas': []
            }
            for row in perfil:
                if row['id_prenda'] is not None:
                    prenda = {
                        'id_prenda': row['id_prenda'],
                        'id_publicacion': row['id_publicacion'],
                        'nombre_prenda': row['nombre_prenda'],
                        'foto_prenda': row['foto_prenda'],
                        'promedio_valoracion': row['promedio_valoracion']
                    }
                    usuario['prendas'].append(prenda)
            return usuario
    finally:
        conexion.close()

@mi_perfil_bp.route("/api/mi_perfil")
def api_mi_perfil():
    id_usuario = session.get('id_usuario')
    if not id_usuario:
        return jsonify({"error": "Usuario no autenticado"}), 401
    
    perfil = obtener_perfil(id_usuario)
    if not perfil:
        return jsonify({"perfil": []})
    return jsonify({"perfil": [perfil]})

# ------------------------------
# Servir imágenes
@mi_perfil_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
