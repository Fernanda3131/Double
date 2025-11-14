print('>>> Cargando perfiles.py')
# ==================== CONFIGURACIÓN ====================

from flask import Blueprint, request, session, jsonify, send_from_directory, current_app
import os
import pymysql
from bd import obtener_conexion

perfiles_bp = Blueprint('perfiles', __name__)

def _get_upload_folder():
    uf = current_app.config.get('UPLOAD_FOLDER') if current_app else None
    if not uf:
        uf = os.path.join(os.getcwd(), "uploads")
    os.makedirs(uf, exist_ok=True)
    return uf

# ==================== API Comunidad ====================
@perfiles_bp.route('/api/estadisticas_comunidad', methods=['GET'])
def estadisticas_comunidad():
    print('>>> Endpoint /api/estadisticas_comunidad registrado')
    """Devuelve estadísticas globales de la comunidad: usuarios activos, prendas activas, prendas para intercambio activas y cantidad de intercambios del mes."""
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Usuarios activos (cuenta todos los usuarios)
            cursor.execute("SELECT COUNT(*) AS total FROM usuario")
            usuarios = cursor.fetchone()["total"]

            # Prendas activas (todas las prendas activas)
            cursor.execute("SELECT COUNT(*) AS total FROM prenda WHERE estado_prenda = 'activo'")
            prendas_activas = cursor.fetchone()["total"]

            # Prendas para intercambio activas
            cursor.execute("""
                SELECT COUNT(*) AS total FROM publicacion p
                JOIN prenda pr ON p.id_prenda = pr.id_prenda
                WHERE p.tipo_publicacion = 'intercambio' AND pr.estado_prenda = 'activo'
            """)
            prendas_intercambio_activas = cursor.fetchone()["total"]

            # Intercambios este mes (publicaciones de tipo 'intercambio' creadas este mes)
            cursor.execute("""
                SELECT COUNT(*) AS total FROM publicacion
                WHERE tipo_publicacion = 'intercambio'
                AND MONTH(fecha_creacion) = MONTH(CURDATE())
                AND YEAR(fecha_creacion) = YEAR(CURDATE())
            """)
            intercambios_mes = cursor.fetchone()["total"]

        return jsonify({
            "usuarios_activos": usuarios,
            "prendas_activas": prendas_activas,
            "prendas_intercambio_activas": prendas_intercambio_activas,
            "intercambios_mes": intercambios_mes
        })
    except Exception as e:
        return jsonify({
            "usuarios_activos": 0,
            "prendas_activas": 0,
            "prendas_intercambio_activas": 0,
            "intercambios_mes": 0,
            "error": str(e)
        }), 500
    finally:
        conexion.close()

# ==================== CONFIGURACIÓN ====================
perfiles_bp = Blueprint('perfiles', __name__)

def _get_upload_folder():
    uf = current_app.config.get('UPLOAD_FOLDER') if current_app else None
    if not uf:
        uf = os.path.join(os.getcwd(), "uploads")
    os.makedirs(uf, exist_ok=True)
    return uf


# ==================== QUERIES ====================
def otros_perfil(id_usuario):
    """Obtiene las publicaciones y datos básicos de un usuario desde la vista vista_otros_perfiles."""
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                SELECT 
                    id_usuario,
                    PrimerNombre,
                    SegundoNombre,
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
            return filas
    finally:
        conexion.close()


def ef_valoracion_usuario(id_usuario):
    """Calcula el promedio de valoraciones de un usuario."""
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                SELECT 
                    u.id_usuario,
                    u.primer_nombre AS PrimerNombre,
                    u.segundo_nombre AS SegundoNombre,
                    AVG(v.puntaje) AS promedio_valoracion
                FROM usuario u
                LEFT JOIN valoracion v 
                       ON u.id_usuario = v.usuario_valorado_id
                WHERE u.id_usuario = %s
                GROUP BY u.id_usuario, u.primer_nombre, u.segundo_nombre
                """,
                (id_usuario,)
            )
            filas = cursor.fetchall()
            return filas
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
    # Primero, obtener datos del usuario directamente
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            # Obtener datos básicos del usuario
            cursor.execute(
                """
                SELECT 
                    id_usuario,
                    primer_nombre AS PrimerNombre,
                    segundo_nombre AS SegundoNombre,
                    primer_apellido AS PrimerApellido,
                    segundo_apellido AS SegundoApellido,
                    username AS username_usuario,
                    email AS email_usuario,
                    foto AS foto_usuario,
                    talla,
                    fecha_nacimiento,
                    creado_en
                FROM usuario
                WHERE id_usuario = %s
                """,
                (id_usuario,)
            )
            datos_usuario = cursor.fetchone()
            
            if not datos_usuario:
                return jsonify({"error": "Usuario no encontrado"}), 404
    finally:
        conexion.close()
    
    # Obtener promedio de valoración
    promedio = ef_valoracion_usuario(id_usuario)
    promedio_valoracion = promedio[0]['promedio_valoracion'] if promedio else 0
    
    # Obtener prendas del usuario
    datos_prendas = otros_perfil(id_usuario)
    
    # Construir el perfil completo
    perfil = {
        "id_usuario": datos_usuario["id_usuario"],
        "PrimerNombre": datos_usuario["PrimerNombre"] or "",
        "SegundoNombre": datos_usuario["SegundoNombre"] or "",
        "PrimerApellido": datos_usuario["PrimerApellido"] or "",
        "SegundoApellido": datos_usuario["SegundoApellido"] or "",
        "username_usuario": datos_usuario["username_usuario"] or "",
        "email_usuario": datos_usuario["email_usuario"] or "",
        "foto_usuario": datos_usuario["foto_usuario"] or "default.jpg",
        "talla_usuario": datos_usuario["talla"] or "",
        "fecha_nacimiento": str(datos_usuario["fecha_nacimiento"]) if datos_usuario.get("fecha_nacimiento") else "",
        "creado_en": str(datos_usuario["creado_en"]) if datos_usuario.get("creado_en") else "",
        "promedio_valoracion": promedio_valoracion,
        "prendas": []
    }
    
    # Agregar prendas si existen
    for p in datos_prendas:
        if p.get("id_prenda") is not None:
            # Asegurarse de que siempre hay una foto
            foto_prenda = p["foto_prenda"] if p["foto_prenda"] else "default.jpg"
            
            perfil["prendas"].append({
                "id_prenda": p["id_prenda"],
                "id_publicacion": p["id_publicacion"],
                "nombre_prenda": p["nombre_prenda"],
                "foto_prenda": foto_prenda,
                "promedio_valoracion": promedio_valoracion
            })

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
    """Perfil de otro usuario (por ejemplo, el dueño de una prenda)."""
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
    upload_folder = _get_upload_folder()
    return send_from_directory(upload_folder, filename)


@perfiles_bp.route('/default-user.png')
def default_user_image():
    """Sirve una imagen por defecto para usuarios sin foto."""
    # Crear una respuesta SVG simple como imagen por defecto
    svg_content = '''<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <circle cx="75" cy="75" r="70" fill="#a07e44" stroke="#7c5e2c" stroke-width="5"/>
        <circle cx="75" cy="60" r="20" fill="white"/>
        <path d="M40 110 Q75 90 110 110" stroke="white" stroke-width="8" fill="none" stroke-linecap="round"/>
    </svg>'''
    
    from flask import Response
    return Response(svg_content, mimetype='image/svg+xml')