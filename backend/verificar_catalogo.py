from bd import obtener_conexion
import pymysql

def verificar_catalogo():
    conexion = obtener_conexion()
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            # Ver si existe la vista catalogo
            cursor.execute("SHOW FULL TABLES WHERE Table_type = 'VIEW'")
            vistas = cursor.fetchall()
            print("\n=== VISTAS EN LA BASE DE DATOS ===")
            for vista in vistas:
                print(f"- {list(vista.values())[0]}")
            
            # Ver si existe específicamente la vista catalogo
            cursor.execute("SHOW FULL TABLES LIKE 'catalogo'")
            resultado = cursor.fetchone()
            
            if resultado:
                print("\n✅ La vista 'catalogo' EXISTE")
                
                # Ver estructura de la vista
                cursor.execute("DESCRIBE catalogo")
                columnas = cursor.fetchall()
                print("\n=== ESTRUCTURA DE LA VISTA CATALOGO ===")
                for col in columnas:
                    print(f"- {col['Field']} ({col['Type']})")
                
                # Ver cuántos registros tiene
                cursor.execute("SELECT COUNT(*) as total FROM catalogo")
                total = cursor.fetchone()
                print(f"\n📊 Total de registros en catalogo: {total['total']}")
                
                # Ver los últimos 5 registros
                if total['total'] > 0:
                    cursor.execute("SELECT * FROM catalogo ORDER BY id_publicacion DESC LIMIT 5")
                    registros = cursor.fetchall()
                    print("\n=== ÚLTIMOS 5 REGISTROS ===")
                    for reg in registros:
                        print(f"ID: {reg.get('id_publicacion')} - {reg.get('nombre_prenda')} - Estado: {reg.get('estado', 'N/A')}")
            else:
                print("\n❌ La vista 'catalogo' NO EXISTE")
                print("\n🔍 Buscando tablas relacionadas...")
                cursor.execute("SHOW TABLES LIKE '%public%'")
                tablas = cursor.fetchall()
                for tabla in tablas:
                    print(f"- {list(tabla.values())[0]}")
                
                cursor.execute("SHOW TABLES LIKE '%prend%'")
                tablas = cursor.fetchall()
                for tabla in tablas:
                    print(f"- {list(tabla.values())[0]}")
    
    finally:
        conexion.close()

if __name__ == "__main__":
    verificar_catalogo()
