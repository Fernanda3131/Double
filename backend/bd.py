import pymysql

def obtener_conexion():
    return pymysql.connect(
        host='localhost',
        port=3307,
        user='root',
        password='',
        database='Double_P',
        cursorclass=pymysql.cursors.DictCursor
    )

