from bd import obtener_conexion
import pymysql

conn = obtener_conexion()
cur = conn.cursor(pymysql.cursors.DictCursor)
cur.execute('SELECT id_usuario, username, email, foto, primer_nombre, primer_apellido FROM usuario WHERE id_usuario IN (21, 23)')
rows = cur.fetchall()

print("=" * 80)
print("DATOS DE USUARIOS 21 Y 23")
print("=" * 80)

for r in rows:
    print(f"\nID {r['id_usuario']}:")
    print(f"  username: '{r['username']}'")
    print(f"  email: '{r['email']}'")
    print(f"  foto: '{r['foto']}'")
    print(f"  primer_nombre: '{r['primer_nombre']}'")
    print(f"  primer_apellido: '{r['primer_apellido']}'")

conn.close()
