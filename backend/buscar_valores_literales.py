from bd import obtener_conexion
import pymysql

conn = obtener_conexion()
cur = conn.cursor(pymysql.cursors.DictCursor)
cur.execute("""
    SELECT id_usuario, username, primer_nombre, primer_apellido, foto 
    FROM usuario 
    WHERE primer_nombre = 'primer_nombre' 
       OR primer_apellido = 'primer_apellido'
       OR username = 'username'
""")
rows = cur.fetchall()

print("=" * 80)
print("USUARIOS CON VALORES LITERALES DE PLACEHOLDER")
print("=" * 80)

if rows:
    for r in rows:
        print(f"ID {r['id_usuario']}: username='{r['username']}', primer_nombre='{r['primer_nombre']}', primer_apellido='{r['primer_apellido']}', foto='{r['foto']}'")
        print()
else:
    print("No se encontraron usuarios con valores literales de placeholder")

# Ahora buscar el usuario con ID específico que apareció en el chat
print("=" * 80)
print("USUARIOS RECIENTES (últimos 5)")
print("=" * 80)
cur.execute("SELECT id_usuario, username, primer_nombre, primer_apellido, foto FROM usuario ORDER BY id_usuario DESC LIMIT 5")
rows = cur.fetchall()
for r in rows:
    print(f"ID {r['id_usuario']}: username='{r['username']}', primer_nombre='{r['primer_nombre']}', primer_apellido='{r['primer_apellido']}', foto='{r['foto']}'")

conn.close()
