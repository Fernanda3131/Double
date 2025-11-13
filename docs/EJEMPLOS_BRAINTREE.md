# Ejemplos de Uso - Braintree Integration

## 📋 Índice

1. [Ejemplo Básico](#ejemplo-básico)
2. [Integrar en DetallePrenda](#integrar-en-detalleprenda)
3. [Integrar en Carrito de Compras](#integrar-en-carrito-de-compras)
4. [Pago con Validaciones](#pago-con-validaciones)
5. [Testing con Python](#testing-con-python)
6. [Testing con cURL](#testing-con-curl)

---

## Ejemplo Básico

### Usando el componente BotonPagar

```javascript
import BotonPagar from './BotonPagar';

function MiComponente() {
  return (
    <div>
      <h2>Prenda Vintage - $150.00</h2>
      <BotonPagar 
        amount={150.00}
        id_publicacion={123}
        descripcion="Compra de prenda vintage"
      />
    </div>
  );
}
```

### Navegación directa

```javascript
import { useNavigate } from 'react-router-dom';

function MiComponente() {
  const navigate = useNavigate();

  const handleComprar = () => {
    navigate('/pago-tarjeta', {
      state: {
        amount: 150.00,
        id_publicacion: 123,
        descripcion: 'Compra de prenda vintage'
      }
    });
  };

  return (
    <button onClick={handleComprar}>
      Comprar Ahora
    </button>
  );
}
```

---

## Integrar en DetallePrenda

```javascript
// DetallePrenda.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BotonPagar from './BotonPagar';

function DetallePrenda() {
  const { id } = useParams();
  const [prenda, setPrenda] = useState(null);

  useEffect(() => {
    // Cargar datos de la prenda
    fetch(`http://localhost:5000/api/prendas/${id}`)
      .then(r => r.json())
      .then(data => setPrenda(data));
  }, [id]);

  if (!prenda) return <div>Cargando...</div>;

  return (
    <div className="detalle-prenda">
      <h1>{prenda.nombre}</h1>
      <img src={prenda.foto} alt={prenda.nombre} />
      <p>{prenda.descripcion}</p>
      <p className="precio">${prenda.precio}</p>
      
      {/* Botón de pago integrado */}
      <BotonPagar 
        amount={prenda.precio}
        id_publicacion={id}
        descripcion={`Compra de ${prenda.nombre}`}
        className="large full-width"
      />
    </div>
  );
}

export default DetallePrenda;
```

---

## Integrar en Carrito de Compras

```javascript
// CarritoCompras.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CarritoCompras() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, nombre: 'Prenda 1', precio: 50.00 },
    { id: 2, nombre: 'Prenda 2', precio: 75.00 },
    { id: 3, nombre: 'Prenda 3', precio: 100.00 }
  ]);

  const total = items.reduce((sum, item) => sum + item.precio, 0);

  const handlePagar = () => {
    // Crear una descripción detallada
    const descripcion = `Compra de ${items.length} prendas: ${
      items.map(i => i.nombre).join(', ')
    }`;

    // Navegar con todos los datos
    navigate('/pago-tarjeta', {
      state: {
        amount: total,
        id_publicacion: null, // o crear una orden
        descripcion: descripcion,
        items: items // datos adicionales
      }
    });
  };

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.nombre}</span>
          <span>${item.precio}</span>
        </div>
      ))}
      
      <div className="cart-total">
        <strong>Total:</strong>
        <strong>${total.toFixed(2)}</strong>
      </div>
      
      <button onClick={handlePagar} className="btn-pagar-carrito">
        💳 Proceder al Pago
      </button>
    </div>
  );
}

export default CarritoCompras;
```

---

## Pago con Validaciones

```javascript
// PagarConValidacion.js
import React, { useState } from 'react';
import BotonPagar from './BotonPagar';

function PagarConValidacion() {
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [direccion, setDireccion] = useState('');

  const validarAntesDePagar = () => {
    // Validar términos
    if (!aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return false;
    }

    // Validar dirección
    if (!direccion || direccion.trim().length < 10) {
      alert('Debes ingresar una dirección válida');
      return false;
    }

    // Confirmar
    if (!window.confirm('¿Confirmas tu compra?')) {
      return false;
    }

    // Todo OK, proceder
    return true;
  };

  return (
    <div>
      <h2>Checkout</h2>
      
      <div className="form-group">
        <label>Dirección de envío:</label>
        <input 
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Calle 123 #45-67"
        />
      </div>

      <div className="form-group">
        <label>
          <input 
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
          />
          Acepto los términos y condiciones
        </label>
      </div>

      <BotonPagar 
        amount={150.00}
        id_publicacion={123}
        descripcion="Compra validada"
        onBeforePay={validarAntesDePagar}
      />
    </div>
  );
}

export default PagarConValidacion;
```

---

## Testing con Python

### Test básico

```python
import requests

# Obtener token
response = requests.get('http://localhost:5000/api/pagos/braintree/token')
print(response.json())

# Procesar pago
payload = {
    'payment_method_nonce': 'fake-valid-nonce',
    'amount': '100.00',
    'id_usuario': 1,
    'id_publicacion': 123
}

response = requests.post(
    'http://localhost:5000/api/pagos/braintree/checkout',
    json=payload
)

print(response.json())
```

### Test con AVS/CVV

```python
import requests

payload = {
    'payment_method_nonce': 'fake-valid-nonce',
    'amount': '100.00',
    'id_usuario': 1,
    'id_publicacion': 123,
    'billing_address': {
        'postal_code': '20000',  # AVS: No coincide
        'street_address': '200 Main St',  # AVS: No coincide
        'locality': 'Test City',
        'region': 'CA',
        'country_code': 'US'
    }
}

response = requests.post(
    'http://localhost:5000/api/pagos/braintree/checkout',
    json=payload
)

result = response.json()
print(f"AVS Postal: {result['transaction']['avs_postal_code_response']}")
print(f"AVS Street: {result['transaction']['avs_street_address_response']}")
```

### Script de testing completo

```python
# Ejecutar: python backend/test_braintree.py
# Ver archivo: backend/test_braintree.py
```

---

## Testing con cURL

### Obtener token

```powershell
curl http://localhost:5000/api/pagos/braintree/token
```

### Procesar pago exitoso

```powershell
curl -X POST http://localhost:5000/api/pagos/braintree/checkout `
  -H "Content-Type: application/json" `
  -d '{
    \"payment_method_nonce\": \"fake-valid-nonce\",
    \"amount\": \"100.00\",
    \"id_usuario\": 1,
    \"id_publicacion\": 123
  }'
```

### Procesar pago rechazado

```powershell
curl -X POST http://localhost:5000/api/pagos/braintree/checkout `
  -H "Content-Type: application/json" `
  -d '{
    \"payment_method_nonce\": \"fake-processor-declined-visa-nonce\",
    \"amount\": \"100.00\",
    \"id_usuario\": 1,
    \"id_publicacion\": 123
  }'
```

### Obtener info de testing

```powershell
curl http://localhost:5000/api/pagos/braintree/test-info
```

### Listar todos los pagos

```powershell
curl http://localhost:5000/api/pagos/
```

---

## Consejos y Buenas Prácticas

### 1. Manejo de errores

```javascript
try {
  const response = await fetch('/api/pagos/braintree/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });

  const result = await response.json();

  if (result.success) {
    // Éxito
    console.log('Pago exitoso:', result.transaction.id);
  } else {
    // Error
    console.error('Error:', result.error);
    // Mostrar errores específicos
    result.errors?.forEach(err => {
      console.error(`${err.attribute}: ${err.message}`);
    });
  }
} catch (error) {
  console.error('Error de red:', error);
}
```

### 2. Loading states

```javascript
const [processing, setProcessing] = useState(false);

const handlePay = async () => {
  setProcessing(true);
  try {
    // ... proceso de pago
  } finally {
    setProcessing(false);
  }
};

return (
  <button disabled={processing}>
    {processing ? 'Procesando...' : 'Pagar'}
  </button>
);
```

### 3. Confirmación antes de pagar

```javascript
const handlePay = () => {
  if (window.confirm('¿Confirmas tu compra?')) {
    navigate('/pago-tarjeta', { state: paymentData });
  }
};
```

### 4. Redirección después del pago

```javascript
// En PagoTarjeta.js
if (data.success) {
  setMessage({ text: 'Pago exitoso!', type: 'success' });
  
  setTimeout(() => {
    navigate('/mis-compras', {
      state: { paymentId: data.payment_id }
    });
  }, 2000);
}
```

---

## Más Recursos

- 📚 [Documentación completa](docs/BRAINTREE_INTEGRATION.md)
- 🚀 [Quick Start](QUICK_START_PAGOS.md)
- 🧪 [Test Script](backend/test_braintree.py)
- 🔧 [Braintree Docs](https://developer.paypal.com/braintree/docs/)
