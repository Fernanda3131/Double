

from flask import Blueprint, jsonify
from bd import obtener_conexion

detalle_prenda_bp = Blueprint('detalle_prenda', __name__)


def obtener_detalle_prenda(id_prenda):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            sql = '''
                SELECT 
                    p.id_prenda,
                    p.nombre,
                    u.username,
                    u.id_usuario,
                    pub.descripcion,
                    p.talla,
                    p.foto,
                    p.foto2,
                    p.foto3,
                    p.foto4,
                    p.valor,
                    pub.tipo_publicacion
                FROM prenda p
                INNER JOIN publicacion pub ON p.id_publicacion = pub.id_publicacion
                INNER JOIN usuario u ON pub.id_usuario = u.id_usuario
                WHERE p.id_prenda = %s
            '''
            cursor.execute(sql, (id_prenda,))
            filas = cursor.fetchall()
            columnas = [desc[0] for desc in cursor.description]
            perfil = [dict(zip(columnas, fila)) for fila in filas]
            return perfil
    finally:
        conexion.close()



@detalle_prenda_bp.route("/api/detalle_prenda/<int:id>")
def api_detalle_prenda(id):
    prenda = obtener_detalle_prenda(id)
    if not prenda:
        return {"prenda": []}, 200
    return {"prenda": prenda}, 200
