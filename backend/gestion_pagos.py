"""
Configuración de Braintree para pagos con tarjeta
Documentación: https://developer.paypal.com/braintree/docs/
"""
import braintree
import os
from flask import Blueprint

# Crear el Blueprint
pagos_bp = Blueprint('pagos', __name__, url_prefix='/api/pagos')

# Intentar cargar dotenv si está disponible (opcional)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv no está instalado, usar variables de entorno del sistema

# Configuración del ambiente (sandbox para pruebas)
BRAINTREE_ENVIRONMENT = braintree.Environment.Sandbox

# Credenciales - En producción deben estar en variables de entorno
BRAINTREE_MERCHANT_ID = os.getenv('BRAINTREE_MERCHANT_ID', '7jjsbz6ss7yh85fr')
BRAINTREE_PUBLIC_KEY = os.getenv('BRAINTREE_PUBLIC_KEY', 'ksnrwfqmpvh6hkhd')
BRAINTREE_PRIVATE_KEY = os.getenv('BRAINTREE_PRIVATE_KEY', '80c4c61bf7ba9597fd3bb7c604e961f3')

def get_gateway():
    """
    Retorna el gateway de Braintree configurado
    """
    print("🔧 Configurando gateway de Braintree...")
    print(f"   Environment: {BRAINTREE_ENVIRONMENT}")
    print(f"   Merchant ID: {BRAINTREE_MERCHANT_ID}")
    print(f"   Public Key: {BRAINTREE_PUBLIC_KEY[:10]}...")
    print(f"   Private Key: {'*' * 20}")
    
    gateway = braintree.BraintreeGateway(
        braintree.Configuration(
            environment=BRAINTREE_ENVIRONMENT,
            merchant_id=BRAINTREE_MERCHANT_ID,
            public_key=BRAINTREE_PUBLIC_KEY,
            private_key=BRAINTREE_PRIVATE_KEY
        )
    )
    print("✅ Gateway configurado exitosamente")
    return gateway


# Tarjetas de prueba para sandbox (según documentación oficial)
TEST_CARDS = {
    'visa_approved': '4111111111111111',
    'visa_declined': '4000111111111115',
    'mastercard_approved': '5555555555554444',
    'mastercard_declined': '5105105105105100',
    'amex_approved': '378282246310005',
    'amex_declined': '378734493671000',
    'discover_approved': '6011000991300009',
    'discover_declined': '6011000990139424',
}

# Respuestas AVS según postal code
AVS_POSTAL_CODES = {
    '20000': 'N',  # No coincide
    '20001': 'U',  # No verificado
    # Cualquier otro código: 'M' (coincide)
}

# Respuestas CVV según valor
CVV_RESPONSES = {
    '200': 'N',   # No coincide
    '201': 'U',   # No verificado
    '301': 'S',   # Emisor no participa
    # Cualquier otro: 'M' (coincide)
}


# Nonces mínimos de prueba (sin rangos de monto)
TEST_NONCES = {
    'valid': 'fake-valid-nonce',
    'visa': 'fake-valid-visa-nonce',
    'mastercard': 'fake-valid-mastercard-nonce',
    'amex': 'fake-valid-amex-nonce',
    'luhn_invalid': 'fake-luhn-invalid-nonce',
}

# ========== ENDPOINTS ==========
from flask import jsonify, request

@pagos_bp.route('/braintree/token', methods=['GET'])
def get_client_token():
    """
    Genera un token de cliente para Braintree
    """
    try:
        gateway = get_gateway()
        client_token = gateway.client_token.generate()
        return jsonify({
            'success': True,
            'clientToken': client_token,
            'testCards': TEST_CARDS
        }), 200
    except Exception as e:
        print(f"❌ Error generando token: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@pagos_bp.route('/braintree/checkout', methods=['POST'])
def process_payment():
    """
    Procesa un pago con Braintree y lo guarda en la base de datos
    """
    try:
        from bd import obtener_conexion
        from datetime import datetime
        import pymysql
        
        data = request.json
        nonce = data.get('payment_method_nonce')
        amount = data.get('amount')
        
        # Obtener id_usuario del body o header
        id_usuario = data.get('id_usuario') or request.headers.get('X-Id-Usuario')
        id_publicacion = data.get('id_publicacion')
        
        print(f"📋 Datos recibidos:")
        print(f"   - Nonce: {nonce[:20] if nonce else 'None'}...")
        print(f"   - Amount: {amount}")
        print(f"   - ID Usuario: {id_usuario}")
        print(f"   - ID Publicación: {id_publicacion}")
        
        if not nonce or not amount:
            return jsonify({
                'success': False,
                'error': 'Datos incompletos (nonce o amount)'
            }), 400
        
        if not id_usuario:
            return jsonify({
                'success': False,
                'error': 'Usuario no autenticado'
            }), 401
        
        # Procesar pago con Braintree
        gateway = get_gateway()
        result = gateway.transaction.sale({
            'amount': str(amount),
            'payment_method_nonce': nonce,
            'options': {
                'submit_for_settlement': True
            }
        })
        
        if result.is_success:
            transaction_id = result.transaction.id
            print(f"✅ Pago procesado por Braintree: {transaction_id}")
            
            # Guardar pago en la base de datos
            try:
                conexion = obtener_conexion()
                with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
                    # Obtener el vendedor de la publicación
                    id_vendedor = None
                    if id_publicacion:
                        cursor.execute(
                            "SELECT id_usuario FROM publicacion WHERE id_publicacion = %s",
                            (int(id_publicacion),)
                        )
                        pub = cursor.fetchone()
                        if pub:
                            id_vendedor = pub['id_usuario']
                            print(f"   - ID Vendedor obtenido: {id_vendedor}")
                    
                    cursor.execute(
                        """
                        INSERT INTO pago (id_usuario_comprador, id_usuario_vendedor, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago, transaction_id)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            int(id_usuario),
                            int(id_vendedor) if id_vendedor else None,
                            int(id_publicacion) if id_publicacion else None,
                            float(amount),
                            'Tarjeta',
                            'Completado',
                            datetime.now(),
                            transaction_id
                        )
                    )
                    id_pago = cursor.lastrowid
                    
                    # Marcar la publicación como No Disponible dentro del mismo bloque with
                    if id_publicacion:
                        print(f"🔄 Marcando publicación {id_publicacion} como No Disponible...")
                        
                        cursor.execute(
                            "UPDATE publicacion SET estado = 'No Disponible' WHERE id_publicacion = %s",
                            (int(id_publicacion),)
                        )
                        filas_actualizadas = cursor.rowcount
                        print(f"   - Publicaciones actualizadas: {filas_actualizadas}")
                        
                        if filas_actualizadas > 0:
                            print(f"✅ Publicación {id_publicacion} marcada como No Disponible")
                        else:
                            print(f"⚠️ No se encontró la publicación {id_publicacion}")
                
                # Hacer commit de todo junto
                conexion.commit()
                print(f"✅ Pago guardado en BD: ID {id_pago}")
                
                conexion.close()
            except Exception as db_error:
                print(f"⚠️ Error guardando en BD: {db_error}")
                import traceback
                traceback.print_exc()
                # Continuar aunque falle el guardado en BD
            
            return jsonify({
                'success': True,
                'transaction': {
                    'id': result.transaction.id,
                    'amount': result.transaction.amount,
                    'status': result.transaction.status
                }
            }), 200
        else:
            print(f"❌ Pago rechazado por Braintree: {result.message}")
            return jsonify({
                'success': False,
                'error': result.message
            }), 400
            
    except Exception as e:
        print(f"❌ Error procesando pago: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500