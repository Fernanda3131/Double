# 🔑 Cómo Obtener Credenciales de Braintree

## Paso 1: Crear Cuenta Sandbox

1. Ve a: **https://www.braintreepayments.com/sandbox**
2. Haz clic en **"Sign Up"** (Registrarse)
3. Completa el formulario:
   - Email
   - Contraseña
   - Nombre de tu negocio
4. Verifica tu email
5. Inicia sesión

## Paso 2: Acceder al Control Panel

1. Una vez dentro, verás el **Dashboard** principal
2. En la esquina superior derecha, haz clic en el **icono de engranaje ⚙️** (Settings)

## Paso 3: Obtener las Credenciales

1. En el menú lateral izquierdo, busca y haz clic en **"API"** o **"API Keys"**
2. Verás una sección llamada **"API Keys"**
3. Allí encontrarás tus credenciales:

```
🔹 Merchant ID: xxxxxxxxxxxxxxxx
🔹 Public Key: xxxxxxxxxxxxxxxx
🔹 Private Key: xxxxxxxxxxxxxxxx
```

## Paso 4: Copiar las Credenciales

### Opción A: Crear archivo .env (Recomendado)

1. Crea un archivo llamado `.env` en la carpeta `backend`
2. Copia y pega este contenido:

```env
BRAINTREE_MERCHANT_ID=tu_merchant_id_aqui
BRAINTREE_PUBLIC_KEY=tu_public_key_aqui
BRAINTREE_PRIVATE_KEY=tu_private_key_aqui
```

3. Reemplaza los valores con tus credenciales reales

### Opción B: Configurar directamente en braintree_config.py

Si no quieres usar .env, puedes editar directamente:

1. Abre: `backend/braintree_config.py`
2. Encuentra estas líneas:

```python
BRAINTREE_MERCHANT_ID = os.getenv('BRAINTREE_MERCHANT_ID', 'your_merchant_id')
BRAINTREE_PUBLIC_KEY = os.getenv('BRAINTREE_PUBLIC_KEY', 'your_public_key')
BRAINTREE_PRIVATE_KEY = os.getenv('BRAINTREE_PRIVATE_KEY', 'your_private_key')
```

3. Reemplázalas con tus credenciales:

```python
BRAINTREE_MERCHANT_ID = 'tu_merchant_id_real'
BRAINTREE_PUBLIC_KEY = 'tu_public_key_real'
BRAINTREE_PRIVATE_KEY = 'tu_private_key_real'
```

## 📸 Captura de Pantalla de Referencia

Cuando estés en el Control Panel de Braintree:

```
┌─────────────────────────────────────────┐
│  Braintree Control Panel                │
│  ⚙️ Settings                            │
│  ├── Business                           │
│  ├── Processing                         │
│  ├── API ← AQUÍ                         │
│  │   └── API Keys ← AQUÍ                │
│  ├── Webhooks                           │
│  └── Users                              │
└─────────────────────────────────────────┘
```

## ⚠️ Importante

- ✅ Estas son credenciales de **SANDBOX** (pruebas)
- ❌ **NO** las compartas públicamente
- ❌ **NO** las subas a GitHub
- ✅ Úsalas solo en ambiente de desarrollo
- ✅ Para producción necesitarás crear una cuenta real

## 🧪 Verificar que Funcionan

Una vez configuradas, ejecuta:

```powershell
cd backend
python test_braintree.py
```

Si ves respuestas exitosas, ¡las credenciales funcionan! ✅

## 📧 Enviarme las Credenciales

Para enviarme tus credenciales de forma segura:

1. Copia los 3 valores (Merchant ID, Public Key, Private Key)
2. Envíamelos por el chat
3. O crea el archivo `.env` y compártelo

**Formato para copiar:**
```
BRAINTREE_MERCHANT_ID=xxxxxxx
BRAINTREE_PUBLIC_KEY=xxxxxxx
BRAINTREE_PRIVATE_KEY=xxxxxxx
```

---

¿Necesitas ayuda adicional? Avísame y te guío paso a paso.
