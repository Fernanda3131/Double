from bd import obtener_conexion
import pymysql

def eliminar_todas_publicaciones():
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            # Ver todas las publicaciones primero
            cursor.execute("SELECT * FROM publicacion")
            pubs = cursor.fetchall()
            print("\n=== PUBLICACIONES A ELIMINAR ===")
            for pub in pubs:
                print(f"ID: {pub['id_publicacion']} - Estado: {pub['estado']} - Usuario: {pub['id_usuario']}")
            
            # Primero eliminar las prendas (tienen FK a publicacion)
            cursor.execute("DELETE FROM prenda")
            prendas_eliminadas = cursor.rowcount
            print(f"\n✅ {prendas_eliminadas} prendas eliminadas")
            
            # Luego eliminar las publicaciones
            cursor.execute("DELETE FROM publicacion")
            pubs_eliminadas = cursor.rowcount
            print(f"✅ {pubs_eliminadas} publicaciones eliminadas")
            
            conexion.commit()
            
            # Verificar que se eliminaron
            cursor.execute("SELECT COUNT(*) as total FROM catalogo")
            total = cursor.fetchone()
            print(f"\n📊 Total en catálogo: {total['total']}")
            print("\n✅ Todas las publicaciones han sido eliminadas correctamente")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conexion.close()

if __name__ == "__main__":
    eliminar_todas_publicaciones()
