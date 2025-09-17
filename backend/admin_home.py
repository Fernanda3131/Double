from flask import Blueprint, jsonify
from bd import obtener_conexion

admin_home_bp = Blueprint("admin_home", __name__)

def query_single_value(sql):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(sql)
        result = cursor.fetchone()
    conexion.close()
    return result[0] if result else 0


@admin_home_bp.route('/api/admin/total_usuarios')
def total_usuarios():
    total = query_single_value("SELECT total_usuarios FROM vista_total_usuarios")
    return jsonify({'total_usuarios': total})


@admin_home_bp.route('/api/admin/publicaciones_activas')
def publicaciones_activas():
    total = query_single_value("SELECT publicaciones_activas FROM vista_publicaciones_activas")
    return jsonify({'publicaciones_activas': total})


@admin_home_bp.route('/api/admin/numero_usuarios')
def numero_usuarios():
    total = query_single_value("SELECT numero_usuarios FROM vista_numero_usuarios")
    return jsonify({'numero_usuarios': total})


@admin_home_bp.route('/api/admin/numero_administradores')
def numero_administradores():
    total = query_single_value("SELECT numero_administradores FROM vista_numero_administradores")
    return jsonify({'numero_administradores': total})


@admin_home_bp.route("/api/admin/publicaciones_tipo")
def publicaciones_tipo():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT tipo_publicacion, COUNT(*) AS total
                FROM publicacion
                GROUP BY tipo_publicacion
            """)
            resultados = cursor.fetchall()

        data = [{"tipo": row[0], "total": row[1]} for row in resultados]
        return jsonify({"ok": True, "data": data})

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})
    finally:
        conexion.close()
