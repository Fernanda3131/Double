from bd import obtener_conexion
import pymysql

def actualizar_vista():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            sql = """
CREATE OR REPLACE VIEW catalogo AS
SELECT 
    p.id_publicacion,
    p.descripcion,
    p.estado,
    p.tipo_publicacion,
    p.fecha_publicacion,
    p.id_usuario,
    pr.id_prenda,
    pr.nombre AS nombre_prenda,
    pr.descripcion_prenda,
    pr.talla,
    pr.foto,
    pr.foto2,
    pr.foto3,
    pr.foto4,
    pr.valor
FROM publicacion p
JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
            """
            cursor.execute(sql)
            conexion.commit()
            print("✅ Vista 'catalogo' actualizada correctamente")
            
            # Verificar
            cursor.execute("SELECT COUNT(*) as total FROM catalogo")
            total = cursor.fetchone()
            print(f"📊 Total de registros en catalogo: {total[0]}")
            
            # Ver algunos registros
            cursor.execute("SELECT id_publicacion, nombre_prenda, talla, estado FROM catalogo LIMIT 5")
            registros = cursor.fetchall()
            print("\n=== PRIMEROS 5 REGISTROS ===")
            for reg in registros:
                print(f"ID: {reg[0]} - {reg[1]} - Talla: {reg[2]} - Estado: {reg[3]}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        conexion.close()

if __name__ == "__main__":
    actualizar_vista()
