"""
Configuración de Braintree para pagos con tarjeta
Documentación: https://developer.paypal.com/braintree/docs/
"""
import braintree
import os

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