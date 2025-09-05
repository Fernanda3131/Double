from bd import obtener_conexion


def insertar_publicacion(descripcion, estado, tipo_publicacion, fecha_publicacion, id_usuario):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO publicacion (descripcion, estado, tipo_publicacion, fecha_publicacion, id_usuario) VALUES (%s, %s, %s, %s, %s)",
                       (descripcion, estado, tipo_publicacion, fecha_publicacion, id_usuario))
    conexion.commit()
    conexion.close()


def insertar_prenda(nombre, descripcion_prenda, talla, foto, valor, id_publicacion):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO prenda (nombre, descripcion_prenda, talla, foto, valor, id_publicacion) VALUES (%s, %s, %s, %s, %s, %s)",
                       (nombre, descripcion_prenda, talla, foto, valor, id_publicacion))
    conexion.commit()
    conexion.close()

def insertar_rol(nom_rol):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO rol (nom_rol) VALUES (%s)",
                       (nom_rol))
    conexion.commit()
    conexion.close()

def insertar_usuario(nombre, username, email, contraseña, talla, fecha_nacimiento, foto, id_rol):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO usuario (nombre, username, email, contrasena, talla, fecha_nacimiento, foto, id_rol) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                        (nombre, username, email, contraseña, talla, fecha_nacimiento, foto, id_rol))
    conexion.commit()
    conexion.close()

def insertar_pago(id_usuario, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO pago (id_usuario, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago) VALUES (%s, %s, %s, %s, %s, %s)",
                        (id_usuario, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago))
    conexion.commit()
    conexion.close()

def insertar_valoracion(usuario_valorador_id, usuario_valorado_id, puntaje):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO valoracion (usuario_valorador_id, usuario_valorado_id, puntaje) VALUES (%s, %s, %s)",
                        (usuario_valorador_id, usuario_valorado_id, puntaje))
    conexion.commit()
    conexion.close()

def existe_email(email):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM usuario WHERE email = %s", (email,))
            resultado = cursor.fetchone()
            return resultado[0] > 0  # True si ya existe
    finally:
        conexion.close()

def registrar(nombre, username, email, contrasena, talla, fecha_nacimiento, foto, id_rol):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO usuario (nombre, username, email, contrasena, talla, fecha_nacimiento, foto, id_rol)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (nombre, username, email, contrasena, talla, fecha_nacimiento, foto, id_rol)
            )
        conexion.commit()
        return True
    except Exception as e:
        print("Error al registrar:", e)
        conexion.rollback()
        return False
    finally:
        conexion.close()

