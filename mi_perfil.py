from flask import Flask, render_template, request, redirect, flash, session, url_for
from bd import obtener_conexion

app = Flask(__name__, template_folder='templates')

def mi_perfil(id_usuario):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:  
            cursor.execute(
                """
                SELECT 
                    id_usuario,
                    nombre_usuario,
                    username_usuario,
                    foto_usuario,
                    id_publicacion,
                    id_prenda,
                    nombre_prenda,
                    foto_prenda,
                    promedio_valoracion
                FROM vista_mi_perfil
                WHERE id_usuario = %s
                """,
                (id_usuario,)
            )
            perfil = cursor.fetchall()  # ahora devuelve TUPLAS
            return perfil
    finally:
        conexion.close()

@app.route("/mi_perfil")
def ver_mi_perfil():
    id_usuario = session.get("id_usuario", 1) 

    if not id_usuario:
        return redirect(url_for("login")) 
    
    perfil = mi_perfil(id_usuario) 
    return render_template("mi_perfil.html", perfil=perfil)

if __name__ == "__main__":
    app.run(debug=True)