from flask import Blueprint, request, session, jsonify, send_from_directory
import os
from bd import obtener_conexion

perfiles_bp = Blueprint('perfiles', __name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")


# ==================== QUERIES ====================
def otros_perfil(id_usuario):
    """Obtiene las publicaciones y datos básicos de un usuario."""
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    id_usuario,
                    username_usuario,
                    foto_usuario,
                    id_publicacion,
                    id_prenda,
                    nombre_prenda,
                    foto_prenda,
                    promedio_valoracion
                FROM vista_otros_perfiles
                WHERE id_usuario = %s
                """,
                (id_usuario,)
            )
            filas = cursor.fetchall()
            columnas = [desc[0] for desc in cursor.description]
            return [dict(zip(columnas, fila)) for fila in filas]
    finally:
        conexion.close()


def ef_valoracion_usuario(id_usuario):
    """Calcula el promedio de valoraciones de un usuario."""
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    u.id_usuario,
                    u.nombre AS nombre_usuario,
                    AVG(v.puntaje) AS promedio_valoracion
                FROM usuario u
                LEFT JOIN valoracion v 
                       ON u.id_usuario = v.usuario_valorado_id
                WHERE u.id_usuario = %s
                GROUP BY u.id_usuario, u.nombre;
                """,
                (id_usuario,)
            )
            filas = cursor.fetchall()
            columnas = [desc[0] for desc in cursor.description]
            return [dict(zip(columnas, fila)) for fila in filas]
    finally:
        conexion.close()


def insertar_valoracion(usuario_valorado_id, puntaje):
    """Inserta una valoración para un usuario."""
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO valoracion (usuario_valorado_id, puntaje) 
                VALUES (%s, %s)
                """,
                (usuario_valorado_id, puntaje)
            )
        conexion.commit()
    finally:
        conexion.close()


# ==================== HELPERS ====================
def obtener_datos_perfil(id_usuario):
    """Arma la respuesta JSON del perfil con sus prendas y valoración promedio."""
    datos_perfil = otros_perfil(id_usuario)
    promedio = ef_valoracion_usuario(id_usuario)
    promedio_valoracion = promedio[0]['promedio_valoracion'] if promedio else 0

    if not datos_perfil:
        perfil = {
            "id_usuario": id_usuario,
            "username_usuario": "Usuario Ejemplo",
            "foto_usuario": "default.jpg",
            "promedio_valoracion": promedio_valoracion,
            "prendas": []
        }
    else:
        for p in datos_perfil:
            p['promedio_valoracion'] = promedio_valoracion
        perfil = datos_perfil

    return jsonify({"perfil": perfil})


# ==================== RUTAS ====================
@perfiles_bp.route("/api/perfil_usuario", methods=["GET"])
def ver_perfil_usuario():
    """Perfil del usuario autenticado (requiere sesión)."""
    id_usuario = session.get("id_usuario")
    if not id_usuario:
        return jsonify({"error": "No autenticado"}), 401
    return obtener_datos_perfil(id_usuario)


@perfiles_bp.route("/api/perfil_usuario/<int:id_usuario>", methods=["GET"])
def ver_perfil_otro_usuario(id_usuario):
    """Perfil de otro usuario (ej: dueño de una prenda)."""
    return obtener_datos_perfil(id_usuario)


@perfiles_bp.route("/api/guardar_valoracion", methods=["POST"])
def guardar_valoracion():
    """Guarda una valoración hacia un usuario."""
    data = request.get_json()
    usuario_valorado_id = data.get("usuario_valorado_id")
    puntaje = data.get("puntaje")

    if not usuario_valorado_id or puntaje is None:
        return jsonify({"error": "Datos incompletos"}), 400

    insertar_valoracion(usuario_valorado_id, puntaje)
    return jsonify({"mensaje": "Valoración guardada con éxito"})


@perfiles_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    """Sirve imágenes de la carpeta uploads."""
    return send_from_directory(UPLOAD_FOLDER, filename)