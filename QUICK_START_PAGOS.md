# 🚀 Quick Start - Integración de Pagos Braintree

## Paso 1: Instalar dependencias

```powershell
# Backend
cd backend
pip install -r requirements.txt

# Frontend (no requiere instalación adicional)
```

## Paso 2: Configurar base de datos

```sql
-- Ejecutar en MySQL
mysql -u root -p pipidb < backend/update_pago_braintree.sql
```

## Paso 3: Configurar credenciales

1. Crear cuenta en https://www.braintreepayments.com/sandbox
2. Copiar credenciales de Settings > API Keys
3. Crear archivo `.env` en `backend/`:

```env
BRAINTREE_MERCHANT_ID=tu_merchant_id
BRAINTREE_PUBLIC_KEY=tu_public_key
BRAINTREE_PRIVATE_KEY=tu_private_key
```

## Paso 4: Iniciar servidores

```powershell
# Backend (terminal 1)
cd backend
python app.py

# Frontend (terminal 2)
cd frontend
npm start
```

## Paso 5: Probar pagos

1. Ve a http://localhost:3000/pago-tarjeta
2. Usa estas tarjetas de prueba:
   - **Visa aprobada:** 4111 1111 1111 1111
   - **Mastercard aprobada:** 5555 5555 5555 4444
   - **CVV:** 123 (o cualquier 3 dígitos)
   - **Fecha:** Cualquier fecha futura (ej: 12/25)
   - **Nombre:** Cualquier nombre

3. ¡Haz click en Pagar!

## 📊 Verificar transacción

1. Ve a https://sandbox.braintreegateway.com/
2. Login con tu cuenta
3. Ve a Transactions para ver los pagos

## 🎯 Integrar en tu app

### Opción 1: Usar el botón

```javascript
import BotonPagar from './BotonPagar';

<BotonPagar 
  amount={150.00}
  id_publicacion={123}
  descripcion="Compra de prenda vintage"
/>
```

### Opción 2: Navegar directamente

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

navigate('/pago-tarjeta', {
  state: {
    amount: 150.00,
    id_publicacion: 123,
    descripcion: 'Compra de prenda'
  }
});
```

## ⚠️ Importante

- **NO uses tarjetas reales en sandbox**
- Las transacciones sandbox no cobran dinero real
- Para producción, cambia a credenciales de producción

## 📚 Documentación completa

Ver `docs/BRAINTREE_INTEGRATION.md` para más detalles.

## 🐛 Problemas comunes

### "Error: Cannot find module braintree"
```powershell
pip install braintree
```

### "Invalid credentials"
Verifica que copiaste correctamente las credenciales en `.env`

### CORS error
Asegúrate de que Flask-CORS esté habilitado en `app.py`

---

¡Listo! Ya puedes procesar pagos con tarjetas 🎉
