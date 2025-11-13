from bd import obtener_conexion
import pymysql

conn = obtener_conexion()
cur = conn.cursor(pymysql.cursors.DictCursor)
cur.execute("""
    SELECT id_usuario, username, primer_nombre, primer_apellido, foto 
    FROM usuario 
    WHERE username = 'username' 
       OR username LIKE 'primer_nombre%' 
       OR foto = 'foto'
""")
rows = cur.fetchall()

print("=" * 80)
print("USUARIOS CON DATOS PLACEHOLDER")
print("=" * 80)

if rows:
    for r in rows:
        print(f"ID {r['id_usuario']}: username='{r['username']}', nombre='{r['primer_nombre']}', apellido='{r['primer_apellido']}', foto='{r['foto']}'")
else:
    print("No se encontraron usuarios con datos placeholder")

conn.close()
