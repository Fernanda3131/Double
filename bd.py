import pymysql

def obtener_conexion ():
    return pymysql.connect(host='localhost',
                           user='root',
                           password='3107',
<<<<<<< HEAD
                           database='Double_P')
=======
                           database='Double_P',
                           port=3306)
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
