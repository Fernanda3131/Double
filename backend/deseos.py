from flask import Blueprint, request, jsonify
from bd import obtener_conexion

deseos_bp = Blueprint('deseos', __name__, url_prefix='/deseos')

# Agregar prenda a la lista de deseos de un usuario
@deseos_bp.route('/agregar', methods=['POST'])
def agregar_deseo():
    data = request.get_json()
    id_usuario = data.get('id_usuario')
    id_publicacion = data.get('id_publicacion')
    if not id_usuario or not id_publicacion:
        return jsonify({'success': False, 'error': 'Faltan datos'}), 400
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT IGNORE INTO lista_deseos (id_usuario, id_publicacion)
                VALUES (%s, %s)
            """, (id_usuario, id_publicacion))
        conexion.commit()
        conexion.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Quitar prenda de la lista de deseos de un usuario
@deseos_bp.route('/quitar', methods=['POST'])
def quitar_deseo():
    data = request.get_json()
    id_usuario = data.get('id_usuario')
    id_publicacion = data.get('id_publicacion')
    if not id_usuario or not id_publicacion:
        return jsonify({'success': False, 'error': 'Faltan datos'}), 400
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                DELETE FROM lista_deseos WHERE id_usuario = %s AND id_publicacion = %s
            """, (id_usuario, id_publicacion))
        conexion.commit()
        conexion.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Obtener lista de deseos de un usuario
@deseos_bp.route('/usuario/<int:id_usuario>', methods=['GET'])
def obtener_deseos_usuario(id_usuario):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    p.id_publicacion,
                    pr.id_prenda,
                    pr.nombre AS nombre_prenda,
                    pr.foto,
                    pr.valor,
                    p.tipo_publicacion,
                    p.estado,
                    p.fecha_publicacion,
                    p.id_usuario
                FROM lista_deseos d
                JOIN publicacion p ON d.id_publicacion = p.id_publicacion
                JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
                WHERE d.id_usuario = %s
            """, (id_usuario,))
            deseos = cursor.fetchall()
        conexion.close()
        return jsonify({'success': True, 'deseos': deseos})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Eliminar una prenda de la lista de deseos de todos los usuarios
@deseos_bp.route('/eliminar_de_todos', methods=['POST'])
def eliminar_de_todos():
    data = request.get_json()
    id_publicacion = data.get('id_publicacion')
    if not id_publicacion:
        return jsonify({'success': False, 'error': 'Falta id_publicacion'}), 400
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                DELETE FROM lista_deseos WHERE id_publicacion = %s
            """, (id_publicacion,))
        conexion.commit()
        conexion.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
