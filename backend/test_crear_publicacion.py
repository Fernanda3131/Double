from bd import obtener_conexion
import pymysql
from datetime import datetime

def test_crear_publicacion():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Probar crear una publicación con el procedimiento almacenado
            cursor.callproc("crear_publicacion_prenda", (
                "Publicación de prueba",  # descripcion
                "Disponible",  # estado
                "Venta",  # tipo_publicacion
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # fecha_publicacion
                21,  # id_usuario (asumiendo que existe)
                "Camiseta Test",  # nombre
                "Camiseta de prueba para testing",  # descripcion_prenda
                "M",  # talla
                "test.jpg",  # foto
                None,  # foto2
                None,  # foto3
                None,  # foto4
                15000  # valor
            ))
            conexion.commit()
            print("✅ Publicación creada exitosamente")
            
            # Verificar que se creó
            cursor.execute("SELECT * FROM publicacion ORDER BY id_publicacion DESC LIMIT 1")
            pub = cursor.fetchone()
            print(f"\n📄 Última publicación: ID {pub[0]}")
            
            cursor.execute("SELECT * FROM prenda ORDER BY id_prenda DESC LIMIT 1")
            prenda = cursor.fetchone()
            print(f"👕 Última prenda: ID {prenda[0]} - {prenda[2]}")
            
            # Ver en el catálogo
            cursor.execute("SELECT COUNT(*) FROM catalogo")
            total = cursor.fetchone()
            print(f"\n📊 Total en catálogo: {total[0]}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conexion.close()

if __name__ == "__main__":
    test_crear_publicacion()
