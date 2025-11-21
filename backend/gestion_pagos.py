from flask import Blueprint, jsonify, request
from bd import obtener_conexion
from datetime import datetime, date
from email.utils import parsedate_to_datetime
import pymysql
import re
import braintree
from braintree_config import get_gateway, TEST_CARDS, TEST_NONCES


def _normalize_fecha(fecha_val):
    if fecha_val is None:
        return None
    if isinstance(fecha_val, date) and not isinstance(fecha_val, datetime):
        return fecha_val.strftime('%Y-%m-%d %H:%M:%S')
    if isinstance(fecha_val, datetime):
        return fecha_val.strftime('%Y-%m-%d %H:%M:%S')
    if isinstance(fecha_val, str):
        s = fecha_val.strip()
        if s == '':
            return None
        # ISO
        try:
            dt = datetime.fromisoformat(s)
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except Exception:
            pass
        try:
            dt = parsedate_to_datetime(s)
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except Exception:
            pass
        for fmt in ('%d/%m/%Y %H:%M:%S', '%d/%m/%Y', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d'):
            try:
                dt = datetime.strptime(s, fmt)
                return dt.strftime('%Y-%m-%d %H:%M:%S')
            except Exception:
                continue
    return None


def _get_table_columns(conexion, table_name: str):
    """Devuelve un set con los nombres de columnas existentes en la tabla indicada."""
    try:
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s
                """,
                (table_name,)
            )
            rows = cursor.fetchall()
            return {r['COLUMN_NAME'] for r in rows}
    except Exception:
        return set()


pagos_bp = Blueprint('pagos', __name__, url_prefix='/api/pagos')


def _format_pago_row(row):
    if not row:
        return None
    return {
        'id_pago': row.get('id_pago') or row.get('id'),
        'id_usuario_comprador': row.get('id_usuario_comprador'),
        'id_usuario_vendedor': row.get('id_usuario_vendedor'),
        'id_publicacion': row.get('id_publicacion'),
        'monto': row.get('monto'),
        'metodo_pago': row.get('metodo_pago'),
        'estado_pago': row.get('estado_pago'),
        'transaction_id': row.get('transaction_id'),
        'fecha_pago': row.get('fecha_pago'),
        'card_type': row.get('card_type'),
        'last_4_digits': row.get('last_4_digits'),
    }


@pagos_bp.route('/', methods=['GET'])
def obtener_pagos():
    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT * FROM pago')
        filas = cursor.fetchall()
    conexion.close()
    pagos = [_format_pago_row(f) for f in filas]
    return jsonify(pagos)


@pagos_bp.route('/', methods=['POST'])
def crear_pago():
    datos = request.json or {}
    id_usuario = datos.get('id_usuario')
    id_publicacion = datos.get('id_publicacion')
    monto = datos.get('monto')
    metodo_pago = datos.get('metodo_pago')
    estado_pago = datos.get('estado_pago') or 'PENDIENTE'
    fecha_pago = _normalize_fecha(datos.get('fecha_pago'))

    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute(
            """
            INSERT INTO pago (id_usuario, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (id_usuario, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago),
        )
        new_id = cursor.lastrowid
    conexion.commit()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT * FROM pago WHERE id_pago = %s', (new_id,))
        row = cursor.fetchone()
    conexion.close()
    return jsonify(row), 201


@pagos_bp.route('/<int:id_pago>', methods=['GET'])
def obtener_pago(id_pago):
    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT * FROM pago WHERE id_pago = %s', (id_pago,))
        row = cursor.fetchone()
    conexion.close()
    if not row:
        return jsonify({'error': 'Pago no encontrado'}), 404
    return jsonify(row)


@pagos_bp.route('/<int:id_pago>', methods=['PUT'])
def editar_pago(id_pago):
    datos = request.json or {}
    # Obtener columnas seguras
    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pago' AND TABLE_SCHEMA = DATABASE()")
        cols = {r['COLUMN_NAME'] for r in cursor.fetchall()}

    campos = []
    valores = []
    mapping = {
        'id_usuario': 'id_usuario',
        'id_publicacion': 'id_publicacion',
        'monto': 'monto',
        'metodo_pago': 'metodo_pago',
        'estado_pago': 'estado_pago',
        'fecha_pago': 'fecha_pago',
    }

    for k, v in datos.items():
        col = mapping.get(k) if k in mapping else (k if k in cols else None)
        if col:
            campos.append(f"{col} = %s")
            if col == 'fecha_pago':
                valores.append(_normalize_fecha(v))
            else:
                valores.append(v)

    if not campos:
        return jsonify({'error': 'No hay campos para actualizar'}), 400

    valores.append(id_pago)
    sql = f"UPDATE pago SET {', '.join(campos)} WHERE id_pago = %s"
    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute(sql, tuple(valores))
    conexion.commit()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT * FROM pago WHERE id_pago = %s', (id_pago,))
        row = cursor.fetchone()
    conexion.close()
    if not row:
        return jsonify({'error': 'Pago no encontrado'}), 404
    return jsonify(row)


@pagos_bp.route('/<int:id_pago>', methods=['DELETE'])
def borrar_pago(id_pago):
    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        r = cursor.fetchone()
        if not r or r.get('cnt', 0) == 0:
            conexion.close()
            return jsonify({'error': 'Pago no encontrado'}), 404
        cursor.execute('DELETE FROM pago WHERE id_pago = %s', (id_pago,))
    conexion.commit()
    conexion.close()
    return jsonify({'mensaje': f'Pago {id_pago} eliminado correctamente'})


@pagos_bp.route('/<path:maybe_id>', methods=['DELETE'])
def borrar_pago_tolerante(maybe_id):
    id_pago = None
    try:
        id_pago = int(maybe_id)
    except Exception:
        m = re.search(r"(\d+)", str(maybe_id))
        if m:
            id_pago = int(m.group(1))
    if id_pago is None:
        return jsonify({'error': 'ID inválido'}), 400
    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        r = cursor.fetchone()
        if not r or r.get('cnt', 0) == 0:
            conexion.close()
            return jsonify({'error': 'Pago no encontrado'}), 404
        cursor.execute('DELETE FROM pago WHERE id_pago = %s', (id_pago,))
    conexion.commit()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        after = cursor.fetchone()
        print(f"[borrar_pago_tolerante] after delete check for id={id_pago} -> {after}")
    conexion.close()
    return jsonify({'mensaje': f'Pago {id_pago} eliminado correctamente'})


@pagos_bp.route('/debug/check/<int:id_pago>', methods=['GET'])
def debug_check_pago(id_pago):
    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        row = cursor.fetchone()
        exists = bool(row and row.get('cnt', 0) > 0)
        pago = None
        if exists:
            cursor.execute('SELECT * FROM pago WHERE id_pago = %s', (id_pago,))
            pago = cursor.fetchone()
    conexion.close()
    return jsonify({'exists': exists, 'pago': pago})


@pagos_bp.route('/debug/force_delete/<int:id_pago>', methods=['DELETE'])
def debug_force_delete_pago(id_pago):
    print(f"[debug_force_delete_pago] request to delete id={id_pago}")
    conexion = obtener_conexion()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        before = cursor.fetchone()
        cursor.execute('DELETE FROM pago WHERE id_pago = %s', (id_pago,))
    conexion.commit()
    with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute('SELECT COUNT(*) as cnt FROM pago WHERE id_pago = %s', (id_pago,))
        after = cursor.fetchone()
    conexion.close()
    print(f"[debug_force_delete_pago] before={before} after={after}")
    return jsonify({'before': before, 'after': after})


# ==================== BRAINTREE INTEGRATION ====================

@pagos_bp.route('/braintree/token', methods=['GET'])
def get_client_token():
    """
    Genera un token de cliente para inicializar Braintree en el frontend.
    Documentación: https://developer.paypal.com/braintree/docs/reference/request/client-token/generate
    """
    try:
        print("🔑 Generando token de cliente de Braintree...")
        gateway = get_gateway()
        print("✅ Gateway obtenido")
        client_token = gateway.client_token.generate()
        print(f"✅ Token generado: {client_token[:30]}...")
        return jsonify({
            'success': True,
            'clientToken': client_token,
            'testCards': TEST_CARDS,
            'testNonces': TEST_NONCES
        })
    except Exception as e:
        print(f"❌ Error generando token de cliente: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@pagos_bp.route('/braintree/checkout', methods=['POST'])
def process_payment():
    """
    Procesa un pago con Braintree usando payment_method_nonce.
    
    Nota: El sandbox de Braintree puede simular distintos resultados automáticamente
    según el monto, pero este backend no impone restricciones ni reglas especiales.
    Cualquier monto recibido se envía tal cual a Braintree.
    """
    try:
        datos = request.json or {}
        payment_method_nonce = datos.get('payment_method_nonce')
        amount = datos.get('amount')
        id_usuario_comprador = datos.get('id_usuario')
        id_publicacion = datos.get('id_publicacion')
        id_usuario_vendedor = datos.get('id_usuario_vendedor')
        
        # Información adicional para AVS/CVV
        billing_address = datos.get('billing_address', {})
        device_data = datos.get('device_data')
        
        if not payment_method_nonce or not amount:
            return jsonify({
                'success': False,
                'error': 'Faltan datos requeridos: payment_method_nonce y amount'
            }), 400
        
        # Obtener id_usuario_vendedor de la publicación si no se proporciona
        if not id_usuario_vendedor and id_publicacion:
            conexion = obtener_conexion()
            with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute('SELECT id_usuario FROM publicacion WHERE id_publicacion = %s', (id_publicacion,))
                pub = cursor.fetchone()
                if pub:
                    id_usuario_vendedor = pub['id_usuario']
            conexion.close()
        
        gateway = get_gateway()
        
        # Preparar datos de la transacción
        transaction_data = {
            'amount': str(amount),
            'payment_method_nonce': payment_method_nonce,
            'options': {
                'submit_for_settlement': True  # Enviar automáticamente para liquidación
            }
        }
        
        # Agregar dirección de facturación si está presente (para AVS)
        if billing_address:
            transaction_data['billing'] = {
                'postal_code': billing_address.get('postal_code', ''),
                'street_address': billing_address.get('street_address', ''),
                'extended_address': billing_address.get('extended_address', ''),
                'locality': billing_address.get('locality', ''),
                'region': billing_address.get('region', ''),
                'country_code_alpha2': billing_address.get('country_code', 'US')
            }
        
        # Agregar device data para fraud protection
        if device_data:
            transaction_data['device_data'] = device_data
        
        # Procesar la transacción
        result = gateway.transaction.sale(transaction_data)
        
        if result.is_success:
            transaction = result.transaction

            # Guardar en base de datos (solo columnas existentes)
            conexion = obtener_conexion()
            cols = _get_table_columns(conexion, 'pago')
            with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
                insert_cols = [
                    'id_usuario_comprador',
                    'id_usuario_vendedor',
                    'id_publicacion',
                    'monto',
                    'metodo_pago',
                    'estado_pago',
                    'fecha_pago',
                ]
                insert_vals = [
                    id_usuario_comprador,
                    id_usuario_vendedor,
                    id_publicacion,
                    amount,
                    'braintree',
                    'completado',
                    datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                ]

                # transaction_id si existe en la tabla
                if 'transaction_id' in cols:
                    insert_cols.append('transaction_id')
                    insert_vals.append(transaction.id)

                # Campos opcionales de respuesta si existen en la tabla
                opt_map = {
                    'processor_response_code': getattr(transaction, 'processor_response_code', None),
                    'processor_response_text': getattr(transaction, 'processor_response_text', None),
                    'avs_postal_code_response': getattr(transaction, 'avs_postal_code_response_code', None),
                    'avs_street_address_response': getattr(transaction, 'avs_street_address_response_code', None),
                    'cvv_response_code': getattr(transaction, 'cvv_response_code', None),
                    'card_type': getattr(getattr(transaction, 'credit_card_details', None), 'card_type', None) if hasattr(transaction, 'credit_card_details') else None,
                    'last_4_digits': getattr(getattr(transaction, 'credit_card_details', None), 'last_4', None) if hasattr(transaction, 'credit_card_details') else None,
                }
                for c, v in opt_map.items():
                    if c in cols:
                        insert_cols.append(c)
                        insert_vals.append(v)

                placeholders = ', '.join(['%s'] * len(insert_cols))
                sql = f"INSERT INTO pago ({', '.join(insert_cols)}) VALUES ({placeholders})"
                cursor.execute(sql, tuple(insert_vals))
                new_id = cursor.lastrowid

                # Marcar publicación como NO disponible (vendida) si existe columna estado
                try:
                    cursor.execute("SELECT estado FROM publicacion WHERE id_publicacion = %s", (id_publicacion,))
                    pub = cursor.fetchone()
                    if pub is not None:
                        # Solo actualizar si actualmente está 'Disponible'
                        if pub.get('estado') == 'Disponible':
                            cursor.execute("UPDATE publicacion SET estado = %s WHERE id_publicacion = %s", ('Vendida', id_publicacion))
                except Exception as ex_upd:
                    print(f"⚠️ No se pudo actualizar estado de publicación {id_publicacion}: {ex_upd}")
            conexion.commit()
            conexion.close()
            
            return jsonify({
                'success': True,
                'transaction': {
                    'id': transaction.id,
                    'status': transaction.status,
                    'amount': str(transaction.amount),
                    'processor_response_code': transaction.processor_response_code,
                    'processor_response_text': transaction.processor_response_text,
                    'avs_error_response_code': transaction.avs_error_response_code if hasattr(transaction, 'avs_error_response_code') else None,
                    'avs_postal_code_response': transaction.avs_postal_code_response_code if hasattr(transaction, 'avs_postal_code_response_code') else None,
                    'avs_street_address_response': transaction.avs_street_address_response_code if hasattr(transaction, 'avs_street_address_response_code') else None,
                    'cvv_response_code': transaction.cvv_response_code if hasattr(transaction, 'cvv_response_code') else None,
                    'credit_card': {
                        'card_type': transaction.credit_card_details.card_type if hasattr(transaction, 'credit_card_details') else None,
                        'last_4': transaction.credit_card_details.last_4 if hasattr(transaction, 'credit_card_details') else None,
                        'expiration_date': transaction.credit_card_details.expiration_date if hasattr(transaction, 'credit_card_details') else None,
                    }
                },
                'payment_id': new_id
            })
        else:
            # Error en la transacción
            error_message = result.message
            errors = []
            
            if hasattr(result, 'errors'):
                for error in result.errors.deep_errors:
                    errors.append({
                        'code': error.code,
                        'message': error.message,
                        'attribute': error.attribute
                    })
            
            # Guardar intento fallido (solo columnas existentes)
            conexion = obtener_conexion()
            cols = _get_table_columns(conexion, 'pago')
            with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
                insert_cols = [
                    'id_usuario_comprador',
                    'id_usuario_vendedor',
                    'id_publicacion',
                    'monto',
                    'metodo_pago',
                    'estado_pago',
                    'fecha_pago',
                ]
                insert_vals = [
                    id_usuario_comprador,
                    id_usuario_vendedor,
                    id_publicacion,
                    amount,
                    'braintree',
                    'rechazado',
                    datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                ]

                # Si la tabla tiene transaction_id, guardar como NULL explícito para mantener consistencia
                if 'transaction_id' in cols:
                    insert_cols.append('transaction_id')
                    insert_vals.append(None)

                if 'processor_response_text' in cols:
                    insert_cols.append('processor_response_text')
                    insert_vals.append(error_message)

                placeholders = ', '.join(['%s'] * len(insert_cols))
                sql = f"INSERT INTO pago ({', '.join(insert_cols)}) VALUES ({placeholders})"
                cursor.execute(sql, tuple(insert_vals))
                # No marcamos como vendida en casos rechazados
            conexion.commit()
            conexion.close()
            
            return jsonify({
                'success': False,
                'error': error_message,
                'errors': errors
            }), 400
            
    except Exception as e:
        import traceback
        print("❌ Excepción en process_payment")
        print(f"Tipo: {type(e)} | Mensaje: {e}")
        print(traceback.format_exc())
        origen = 'desconocido'
        if 'Already closed' in str(e):
            origen = 'conexion_mysql'
        return jsonify({
            'success': False,
            'error': str(e),
            'origen': origen
        }), 500


@pagos_bp.route('/braintree/test-info', methods=['GET'])
def get_test_info():
    """
    Retorna información de prueba para Braintree sandbox
    """
    return jsonify({
        'test_cards': TEST_CARDS,
        'test_nonces': TEST_NONCES,
        'avs_responses': {
            'postal_code_20000': 'N (No coincide)',
            'postal_code_20001': 'U (No verificado)',
            'postal_code_other': 'M (Coincide)',
            'street_200': 'N (No coincide)',
            'street_201': 'U (No verificado)',
            'street_other': 'M (Coincide)'
        },
        'cvv_responses': {
            '200': 'N (No coincide)',
            '201': 'U (No verificado)',
            '301': 'S (Emisor no participa)',
            'other': 'M (Coincide)'
        }
    })

