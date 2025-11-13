from bd import obtener_conexion
import pymysql

conn = obtener_conexion()

# Buscar usuarios con valores placeholder
cur = conn.cursor(pymysql.cursors.DictCursor)
cur.execute("""
    SELECT id_usuario, username, email, foto, primer_nombre, primer_apellido
    FROM usuario 
    WHERE username = 'username' 
       OR email = 'email'
       OR foto = 'foto'
       OR primer_nombre = 'primer_nombre'
       OR primer_apellido = 'primer_apellido'
""")
usuarios_problema = cur.fetchall()

print("=" * 80)
print("USUARIOS CON VALORES PLACEHOLDER ENCONTRADOS")
print("=" * 80)

if not usuarios_problema:
    print("✅ No se encontraron usuarios con valores placeholder")
    conn.close()
    exit()

for u in usuarios_problema:
    print(f"\nID: {u['id_usuario']}")
    print(f"  username: '{u['username']}'")
    print(f"  email: '{u['email']}'")
    print(f"  foto: '{u['foto']}'")
    print(f"  primer_nombre: '{u['primer_nombre']}'")
    print(f"  primer_apellido: '{u['primer_apellido']}'")

print("\n" + "=" * 80)
respuesta = input("¿Quieres actualizar estos registros? (s/n): ")

if respuesta.lower() == 's':
    cur2 = conn.cursor()
    
    for u in usuarios_problema:
        updates = []
        valores = []
        
        # Reemplazar username placeholder
        if u['username'] == 'username':
            nuevo_username = f"user_{u['id_usuario']}"
            updates.append("username = %s")
            valores.append(nuevo_username)
            print(f"  Actualizando username a: {nuevo_username}")
        
        # Reemplazar email placeholder
        if u['email'] == 'email':
            nuevo_email = f"user{u['id_usuario']}@ejemplo.com"
            updates.append("email = %s")
            valores.append(nuevo_email)
            print(f"  Actualizando email a: {nuevo_email}")
        
        # Reemplazar foto placeholder
        if u['foto'] == 'foto':
            updates.append("foto = NULL")
            print(f"  Actualizando foto a: NULL")
        
        # Reemplazar primer_nombre placeholder
        if u['primer_nombre'] == 'primer_nombre':
            updates.append("primer_nombre = NULL")
            print(f"  Actualizando primer_nombre a: NULL")
        
        # Reemplazar primer_apellido placeholder
        if u['primer_apellido'] == 'primer_apellido':
            updates.append("primer_apellido = NULL")
            print(f"  Actualizando primer_apellido a: NULL")
        
        if updates:
            valores.append(u['id_usuario'])
            query = f"UPDATE usuario SET {', '.join(updates)} WHERE id_usuario = %s"
            cur2.execute(query, valores)
    
    conn.commit()
    print("\n✅ Usuarios actualizados correctamente")
else:
    print("\n❌ No se realizaron cambios")

conn.close()
