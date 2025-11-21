"""
Script de prueba para la integración de Braintree
Ejecutar: python test_braintree.py
"""

import requests
import json

BASE_URL = 'http://localhost:5000/api/pagos'

def print_response(response, title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except:
        print(response.text)
    print(f"{'='*60}\n")


def test_get_token():
    """Test: Obtener token de cliente"""
    print("\n🔑 Test 1: Obtener Client Token")
    response = requests.get(f'{BASE_URL}/braintree/token')
    print_response(response, "Client Token")
    
    if response.status_code == 200:
        data = response.json()
        return data.get('clientToken')
    return None


def test_get_test_info():
    """Test: Obtener información de prueba"""
    print("\n📋 Test 2: Información de Testing")
    response = requests.get(f'{BASE_URL}/braintree/test-info')
    print_response(response, "Test Info")


def test_payment_with_nonce(nonce_type='valid'):
    """Test: Procesar pago con nonce de prueba"""
    print(f"\n💳 Test 3: Pago con nonce de prueba ({nonce_type})")
    
    # Nonces de prueba
    nonces = {
        'valid': 'fake-valid-nonce',
        'visa': 'fake-valid-visa-nonce',
        'mastercard': 'fake-valid-mastercard-nonce',
        'declined': 'fake-processor-declined-visa-nonce',
    }
    
    payload = {
        'payment_method_nonce': nonces.get(nonce_type, 'fake-valid-nonce'),
        'amount': '100.00',
        'id_usuario': 1,
        'id_publicacion': 1,
        'billing_address': {
            'postal_code': '12345',
            'street_address': '123 Main St',
            'locality': 'Ciudad',
            'region': 'Estado',
            'country_code': 'US'
        }
    }
    
    response = requests.post(
        f'{BASE_URL}/braintree/checkout',
        json=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    print_response(response, f"Pago con {nonce_type}")


def test_payment_declined_amount():
    """Test: Pago con monto que será rechazado"""
    print("\n❌ Test 4: Pago con monto rechazado (2000-2999)")
    
    payload = {
        'payment_method_nonce': 'fake-valid-nonce',
        'amount': '2500.00',  # Este monto será rechazado
        'id_usuario': 1,
        'id_publicacion': 1
    }
    
    response = requests.post(
        f'{BASE_URL}/braintree/checkout',
        json=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    print_response(response, "Pago rechazado por monto")


def test_payment_avs_cvv():
    """Test: Pago con respuestas AVS y CVV específicas"""
    print("\n🔍 Test 5: Pago con verificación AVS/CVV")
    
    payload = {
        'payment_method_nonce': 'fake-valid-nonce',
        'amount': '100.00',
        'id_usuario': 1,
        'id_publicacion': 1,
        'billing_address': {
            'postal_code': '20000',  # Esto dará respuesta AVS "N" (No coincide)
            'street_address': '200 Main St',  # Número 200 = AVS "N"
            'locality': 'Test City',
            'region': 'CA',
            'country_code': 'US'
        }
    }
    
    response = requests.post(
        f'{BASE_URL}/braintree/checkout',
        json=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    print_response(response, "Pago con AVS/CVV Testing")


def test_get_all_payments():
    """Test: Obtener todos los pagos"""
    print("\n📊 Test 6: Listar todos los pagos")
    response = requests.get(f'{BASE_URL}/')
    print_response(response, "Lista de Pagos")


def run_all_tests():
    """Ejecutar todos los tests"""
    print("\n" + "="*60)
    print("  🧪 INICIANDO TESTS DE BRAINTREE")
    print("="*60)
    
    # Test 1: Obtener token
    token = test_get_token()
    
    if not token:
        print("\n❌ Error: No se pudo obtener el token. Verifica:")
        print("  1. Flask está corriendo (python app.py)")
        print("  2. Las credenciales en .env son correctas")
        print("  3. El módulo braintree está instalado (pip install braintree)")
        return
    
    # Test 2: Info de prueba
    test_get_test_info()
    
    # Test 3: Pagos exitosos
    test_payment_with_nonce('valid')
    test_payment_with_nonce('visa')
    test_payment_with_nonce('mastercard')
    
    # Test 4: Pago rechazado
    test_payment_with_nonce('declined')
    
    # Test 5: Pago con monto rechazado
    test_payment_declined_amount()
    
    # Test 6: AVS/CVV
    test_payment_avs_cvv()
    
    # Test 7: Listar pagos
    test_get_all_payments()
    
    print("\n" + "="*60)
    print("  ✅ TESTS COMPLETADOS")
    print("="*60)
    print("\nRevisa los resultados arriba.")
    print("Para ver las transacciones en Braintree:")
    print("👉 https://sandbox.braintreegateway.com/login")


if __name__ == '__main__':
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error de conexión:")
        print("  - Asegúrate de que Flask está corriendo en http://localhost:5000")
        print("  - Ejecuta: cd backend && python app.py")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
