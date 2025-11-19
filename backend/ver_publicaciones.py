from bd import obtener_conexion
import pymysql

def verificar_publicaciones():
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            # Ver publicaciones
            cursor.execute("SELECT * FROM publicacion ORDER BY id_publicacion DESC LIMIT 5")
            pubs = cursor.fetchall()
            print("\n=== PUBLICACIONES ===")
            for pub in pubs:
                print(f"ID: {pub['id_publicacion']} - Estado: {pub['estado']} - Tipo: {pub['tipo_publicacion']} - Usuario: {pub['id_usuario']}")
            
            # Ver prendas
            cursor.execute("SELECT * FROM prenda ORDER BY id_publicacion DESC LIMIT 5")
            prendas = cursor.fetchall()
            print("\n=== PRENDAS ===")
            for prenda in prendas:
                print(f"ID Prenda: {prenda['id_prenda']} - ID Pub: {prenda['id_publicacion']} - Nombre: {prenda['nombre']} - Talla: {prenda['talla']}")
            
            # Ver catalogo actualizado
            cursor.execute("SELECT * FROM catalogo ORDER BY id_publicacion DESC LIMIT 5")
            catalogos = cursor.fetchall()
            print("\n=== CATALOGO (Vista) ===")
            for cat in catalogos:
                print(f"ID: {cat['id_publicacion']} - {cat['nombre_prenda']} - Talla: {cat['talla']} - Estado: {cat['estado']}")
    
    finally:
        conexion.close()

if __name__ == "__main__":
    verificar_publicaciones()
