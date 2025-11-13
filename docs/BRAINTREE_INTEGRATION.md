# Integración de Pagos con Braintree

Esta aplicación ahora incluye integración completa con Braintree (PayPal) para procesar pagos con tarjetas de crédito y débito.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Testing en Sandbox](#testing-en-sandbox)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)

## ✨ Características

- ✅ Procesamiento de pagos con tarjetas de crédito/débito
- ✅ Drop-in UI de Braintree (interfaz lista para usar)
- ✅ Verificación AVS (Address Verification System)
- ✅ Verificación CVV/CID
- ✅ Detección de fraude con Device Data
- ✅ Manejo de errores y respuestas del procesador
- ✅ Ambiente sandbox para pruebas
- ✅ Registro completo de transacciones en base de datos

## 🚀 Instalación

### Backend

1. Instala las dependencias de Python:

```powershell
cd backend
pip install -r requirements.txt
```

2. Actualiza la base de datos:

```powershell
# Conéctate a MySQL y ejecuta:
mysql -u root -p pipidb < update_pago_braintree.sql
```

### Frontend

Las dependencias de Braintree se cargan dinámicamente vía CDN, no requiere instalación adicional.

## ⚙️ Configuración

### 1. Crear cuenta de Braintree Sandbox

1. Ve a https://www.braintreepayments.com/sandbox
2. Crea una cuenta gratuita
3. Accede al Control Panel

### 2. Obtener credenciales

1. En el Control Panel, ve a **Settings > API Keys**
2. Copia tus credenciales:
   - Merchant ID
   - Public Key
   - Private Key

### 3. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend`:

```bash
cp .env.example .env
```

Edita `.env` y agrega tus credenciales:

```env
BRAINTREE_MERCHANT_ID=tu_merchant_id
BRAINTREE_PUBLIC_KEY=tu_public_key
BRAINTREE_PRIVATE_KEY=tu_private_key
```

### 4. Registrar el Blueprint en Flask

En `backend/app.py` o `backend/main.py`, asegúrate de registrar el blueprint:

```python
from gestion_pagos import pagos_bp

app.register_blueprint(pagos_bp)
```

## 🧪 Testing en Sandbox

### Tarjetas de Prueba

| Tarjeta | Número | Resultado |
|---------|--------|-----------|
| Visa (Aprobada) | 4111 1111 1111 1111 | ✅ Autorizada |
| Mastercard (Aprobada) | 5555 5555 5555 4444 | ✅ Autorizada |
| Amex (Aprobada) | 3782 822463 10005 | ✅ Autorizada |
| Visa (Rechazada) | 4000 1111 1111 1115 | ❌ Rechazada |
| Mastercard (Rechazada) | 5105 1051 0510 5100 | ❌ Rechazada |

**Fecha de expiración:** Cualquier fecha futura (ej: 12/25)  
**CVV:** Cualquier 3-4 dígitos (ver respuestas CVV abajo)  
**Nombre:** Cualquier nombre

### Respuestas CVV

| CVV | Respuesta |
|-----|-----------|
| 200 | N - No coincide (rechazado) |
| 201 | U - No verificado |
| 301 | S - Emisor no participa |
| Otro | M - Coincide (aprobado) |

### Respuestas AVS

**Código Postal:**
| Código | Respuesta |
|--------|-----------|
| 20000 | N - No coincide |
| 20001 | U - No verificado |
| Otro | M - Coincide |

**Dirección (número de calle):**
| Número | Respuesta |
|--------|-----------|
| 200 | N - No coincide |
| 201 | U - No verificado |
| Otro | M - Coincide |

### Montos de Prueba

| Monto | Resultado |
|-------|-----------|
| $0.01 - $1,999.99 | ✅ Autorizado y liquidado |
| $2,000.00 - $2,999.99 | ❌ Rechazado por procesador |
| $3,000.00 - $3,000.99 | ❌ Error (código 3000) |
| $4,001.00 - $4,001.99 | ⚠️ Rechazado en liquidación |

### Nonces de Prueba

Para testing directo en el backend:

```python
# Nonces válidos
fake-valid-nonce
fake-valid-visa-nonce
fake-valid-mastercard-nonce
fake-valid-amex-nonce

# Nonces rechazados
fake-processor-declined-visa-nonce
fake-processor-declined-mastercard-nonce
fake-luhn-invalid-nonce
```

## 💻 Uso

### Frontend

1. Navega a `/pago-tarjeta` con los datos del pago:

```javascript
navigate('/pago-tarjeta', {
  state: {
    amount: 150.00,
    id_publicacion: 123,
    descripcion: 'Compra de prenda'
  }
});
```

2. El usuario verá el formulario de Braintree
3. Ingresa los datos de la tarjeta de prueba
4. El pago se procesa automáticamente

### Backend

Llamar directamente al endpoint:

```python
import requests

response = requests.post('http://localhost:5000/api/pagos/braintree/checkout', json={
    'payment_method_nonce': 'fake-valid-nonce',
    'amount': '100.00',
    'id_usuario': 1,
    'id_publicacion': 123,
    'billing_address': {
        'postal_code': '12345',
        'street_address': '123 Main St'
    }
})

print(response.json())
```

## 🔌 API Endpoints

### GET `/api/pagos/braintree/token`

Genera un token de cliente para inicializar Braintree.

**Response:**
```json
{
  "success": true,
  "clientToken": "eyJ2ZXJzaW9uI...",
  "testCards": { ... },
  "testNonces": { ... }
}
```

### POST `/api/pagos/braintree/checkout`

Procesa un pago con Braintree.

**Request:**
```json
{
  "payment_method_nonce": "fake-valid-nonce",
  "amount": "100.00",
  "id_usuario": 1,
  "id_publicacion": 123,
  "billing_address": {
    "postal_code": "12345",
    "street_address": "123 Main St",
    "locality": "Ciudad",
    "region": "Estado",
    "country_code": "US"
  },
  "device_data": "optional_device_fingerprint"
}
```

**Response (éxito):**
```json
{
  "success": true,
  "transaction": {
    "id": "abc123",
    "status": "submitted_for_settlement",
    "amount": "100.00",
    "processor_response_code": "1000",
    "processor_response_text": "Approved",
    "avs_postal_code_response": "M",
    "avs_street_address_response": "M",
    "cvv_response_code": "M",
    "credit_card": {
      "card_type": "Visa",
      "last_4": "1111",
      "expiration_date": "12/2025"
    }
  },
  "payment_id": 456
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "Credit card is invalid",
  "errors": [
    {
      "code": "81715",
      "message": "Credit card number is invalid",
      "attribute": "number"
    }
  ]
}
```

### GET `/api/pagos/braintree/test-info`

Retorna información para testing en sandbox.

**Response:**
```json
{
  "test_cards": { ... },
  "test_nonces": { ... },
  "test_amounts": { ... },
  "avs_responses": { ... },
  "cvv_responses": { ... }
}
```

## 🗄️ Base de Datos

La tabla `pago` se actualiza con los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `transaction_id` | VARCHAR(255) | ID único de transacción Braintree |
| `processor_response_code` | VARCHAR(10) | Código de respuesta del procesador |
| `processor_response_text` | VARCHAR(255) | Mensaje del procesador |
| `avs_postal_code_response` | VARCHAR(2) | Respuesta AVS código postal (M/N/U/I) |
| `avs_street_address_response` | VARCHAR(2) | Respuesta AVS dirección (M/N/U/I) |
| `cvv_response_code` | VARCHAR(2) | Respuesta CVV (M/N/U/S/I) |
| `card_type` | VARCHAR(50) | Tipo de tarjeta (Visa, Mastercard, etc) |
| `last_4_digits` | VARCHAR(4) | Últimos 4 dígitos de la tarjeta |

## 📚 Recursos Adicionales

- [Documentación oficial de Braintree](https://developer.paypal.com/braintree/docs/)
- [Testing en Sandbox](https://developer.paypal.com/braintree/docs/reference/general/testing/ruby)
- [Drop-in UI](https://developer.paypal.com/braintree/docs/guides/drop-in/overview)
- [AVS y CVV Testing](https://developer.paypal.com/braintree/docs/reference/general/testing/ruby#avs-and-cvv/cid-responses)

## 🔒 Seguridad

### Producción

Antes de pasar a producción:

1. Cambia el ambiente a production en `braintree_config.py`:
```python
BRAINTREE_ENVIRONMENT = braintree.Environment.Production
```

2. Obtén credenciales de producción del Control Panel

3. Actualiza las variables de entorno

4. Habilita SSL/HTTPS en tu servidor

5. Considera implementar:
   - Rate limiting
   - Logs de auditoría
   - Monitoreo de transacciones
   - Alertas de fraude

### PCI Compliance

Braintree maneja el PCI compliance por ti:
- Los datos de tarjetas nunca tocan tu servidor
- Todo se procesa en los servidores de Braintree
- Obtienes solo un token (nonce) para procesar pagos

## 🐛 Troubleshooting

### Error: "Cannot find module braintree"

```powershell
pip install braintree
```

### Error: "Invalid credentials"

Verifica que tus credenciales en `.env` sean correctas y que estés usando las del ambiente correcto (sandbox vs production).

### Error de CORS

Asegúrate de que Flask-CORS esté configurado correctamente en tu backend.

### Transacción aparece como "pending"

En sandbox, algunas transacciones quedan pending. Usa el método de testing para cambiar el estado:

```python
gateway = get_gateway()
result = gateway.testing.settle(transaction_id)
```

## 📞 Soporte

Para problemas con Braintree:
- [Support Center](https://developer.paypal.com/braintree/help)
- [Community Forums](https://www.paypal-community.com/t5/Braintree/ct-p/Braintree)

---

**Documentación creada:** Noviembre 2025  
**Versión de Braintree SDK:** Python 4.x  
**Versión de Drop-in UI:** 1.33.7
