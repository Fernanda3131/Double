# Instalación de Braintree - Guía Paso a Paso

## 📦 Instalación del SDK

### Windows (PowerShell)

```powershell
# Navega a la carpeta del backend
cd backend

# Instala Braintree
pip install braintree

# O instala todas las dependencias
pip install -r requirements.txt
```

### Verificar instalación

```powershell
python -c "import braintree; print(braintree.__version__)"
```

Deberías ver algo como: `4.x.x`

## ⚙️ Configuración Inicial

### 1. Crear cuenta Sandbox

1. Ve a: https://www.braintreepayments.com/sandbox
2. Haz click en "Sign Up"
3. Completa el formulario
4. Verifica tu email
5. Accede al Control Panel

### 2. Obtener credenciales

En el Control Panel de Braintree:

1. Ve a **Settings** (⚙️ en la esquina superior derecha)
2. Click en **API Keys**
3. Verás tus credenciales:
   ```
   Merchant ID: xxxxxxxxx
   Public Key: xxxxxxxxx
   Private Key: xxxxxxxxx
   ```

### 3. Configurar variables de entorno

Crea el archivo `.env` en la carpeta `backend`:

```powershell
cd backend
Copy-Item .env.example .env
```

Edita `.env` con tu editor favorito:

```env
BRAINTREE_MERCHANT_ID=tu_merchant_id_aqui
BRAINTREE_PUBLIC_KEY=tu_public_key_aqui
BRAINTREE_PRIVATE_KEY=tu_private_key_aqui
```

**⚠️ IMPORTANTE:** 
- No compartas estas credenciales
- No las subas a Git (el archivo `.env` debe estar en `.gitignore`)
- Son credenciales de SANDBOX, no funcionan en producción

## 🗄️ Actualizar Base de Datos

```powershell
# Conéctate a MySQL
mysql -u root -p

# Selecciona tu base de datos
USE pipidb;

# Ejecuta el script de actualización
source backend/update_pago_braintree.sql;

# O en una sola línea:
mysql -u root -p pipidb < backend/update_pago_braintree.sql
```

Esto agregará las siguientes columnas a la tabla `pago`:
- `transaction_id`
- `processor_response_code`
- `processor_response_text`
- `avs_postal_code_response`
- `avs_street_address_response`
- `cvv_response_code`
- `card_type`
- `last_4_digits`

## 🚀 Iniciar la Aplicación

### Backend

```powershell
cd backend
python app.py
```

Deberías ver:
```
 * Running on http://127.0.0.1:5000
```

### Frontend

```powershell
# En otra terminal
cd frontend
npm start
```

Se abrirá en: http://localhost:3000

## ✅ Verificar que todo funciona

### Test 1: Endpoint de token

Abre en el navegador o usa curl:
```
http://localhost:5000/api/pagos/braintree/token
```

Deberías ver algo como:
```json
{
  "success": true,
  "clientToken": "eyJ2ZXJzaW9uI...",
  "testCards": {...}
}
```

### Test 2: Test info

```
http://localhost:5000/api/pagos/braintree/test-info
```

### Test 3: Script de prueba

```powershell
cd backend
python test_braintree.py
```

Verás una serie de tests ejecutándose.

### Test 4: UI de pago

1. Ve a: http://localhost:3000/pago-tarjeta
2. Deberías ver el formulario de Braintree
3. Usa una tarjeta de prueba:
   - Número: `4111 1111 1111 1111`
   - CVV: `123`
   - Fecha: `12/25`
   - Nombre: Cualquiera
4. Haz click en "Pagar"

## 🐛 Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'braintree'"

```powershell
pip install braintree
```

### Error: "ModuleNotFoundError: No module named 'dotenv'"

```powershell
pip install python-dotenv
```

### Error: "Invalid credentials"

1. Verifica que copiaste bien las credenciales en `.env`
2. Asegúrate de no tener espacios extra
3. Las credenciales son case-sensitive
4. Verifica que el archivo se llama `.env` (no `.env.txt`)

### Error: "Table 'pago' doesn't have column 'transaction_id'"

Ejecuta el script SQL:
```powershell
mysql -u root -p pipidb < backend/update_pago_braintree.sql
```

### Error: CORS

En `backend/app.py`, verifica que tengas:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
```

### Error: "Cannot find module './braintree_config'"

Verifica que el archivo `braintree_config.py` existe en `backend/`

### Puerto 5000 ocupado

Si el puerto 5000 está ocupado:
```powershell
# En app.py, cambia:
app.run(debug=True, port=5001)
```

Y actualiza las URLs en el frontend a `http://localhost:5001`

## 📝 Checklist de Instalación

- [ ] Python 3.7+ instalado
- [ ] pip actualizado (`pip install --upgrade pip`)
- [ ] braintree instalado (`pip install braintree`)
- [ ] Cuenta sandbox creada
- [ ] Credenciales copiadas a `.env`
- [ ] Base de datos actualizada
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Endpoint de token funciona
- [ ] Formulario de pago se carga correctamente

## 🎯 Próximos Pasos

Una vez que todo funciona:

1. ✅ Lee la [documentación completa](BRAINTREE_INTEGRATION.md)
2. ✅ Revisa los [ejemplos de uso](EJEMPLOS_BRAINTREE.md)
3. ✅ Prueba diferentes escenarios de testing
4. ✅ Integra el botón de pago en tus componentes
5. ✅ Configura webhooks (opcional)
6. ✅ Personaliza el Drop-in UI

## 🔐 Pasar a Producción

**NO uses credenciales de sandbox en producción**

Para producción:

1. Crea una cuenta de producción en Braintree
2. Completa el proceso de verificación
3. Obtén tus credenciales de producción
4. En `braintree_config.py` cambia:
   ```python
   BRAINTREE_ENVIRONMENT = braintree.Environment.Production
   ```
5. Actualiza el `.env` con credenciales de producción
6. Activa SSL/HTTPS en tu servidor
7. Configura webhooks para notificaciones

## 📚 Recursos Adicionales

- [Documentación oficial de Braintree](https://developer.paypal.com/braintree/docs/)
- [Testing Guide](https://developer.paypal.com/braintree/docs/reference/general/testing/ruby)
- [Drop-in UI](https://developer.paypal.com/braintree/docs/guides/drop-in/overview)
- [Control Panel Sandbox](https://sandbox.braintreegateway.com/login)

## 💬 Soporte

Si tienes problemas:

1. Revisa esta guía completa
2. Consulta los logs del backend
3. Revisa la consola del navegador (F12)
4. Lee la documentación oficial
5. Contacta soporte de Braintree

---

¡Listo! Ya tienes todo instalado y configurado 🎉
