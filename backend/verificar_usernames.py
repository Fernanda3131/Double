from bd import obtener_conexion
import pymysql

conn = obtener_conexion()
cur = conn.cursor(pymysql.cursors.DictCursor)
cur.execute('SELECT id_usuario, username, primer_nombre, segundo_nombre, foto FROM usuario LIMIT 10')
rows = cur.fetchall()

print("=" * 80)
print("USUARIOS EN LA BASE DE DATOS")
print("=" * 80)

for row in rows:
    print(f"ID: {row['id_usuario']}")
    print(f"  username: '{row['username']}'")
    print(f"  primer_nombre: '{row['primer_nombre']}'")
    print(f"  segundo_nombre: '{row['segundo_nombre']}'")
    print(f"  foto: '{row['foto']}'")
    print("-" * 80)

conn.close()
