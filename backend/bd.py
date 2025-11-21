import pymysql

def obtener_conexion():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='3107',
        database='Double_P',
        cursorclass=pymysql.cursors.DictCursor
    )

