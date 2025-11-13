import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PagoTarjeta.css';

function PagoTarjeta() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [testInfo, setTestInfo] = useState(null);
  const [showTestInfo, setShowTestInfo] = useState(false);
  
  // Datos del pago (pueden venir de location.state o props)
  const paymentData = location.state || {
    amount: 100.00,
    id_publicacion: null,
    descripcion: 'Compra de prenda'
  };

  useEffect(() => {
    // Cargar el script de Braintree
    const script = document.createElement('script');
    script.src = 'https://js.braintreegateway.com/web/dropin/1.33.7/js/dropin.min.js';
    script.async = true;
    script.onload = () => {
      fetchClientToken();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchClientToken = async () => {
    try {
      const headers = {
        "X-Id-Rol": localStorage.getItem("id_rol") || "",
        "X-Id-Usuario": localStorage.getItem("id_usuario") || "",
        "Content-Type": "application/json",
      };

      console.log('🔑 Solicitando token de Braintree...');
      const response = await fetch('http://localhost:5000/api/pagos/braintree/token', {
        credentials: "include",
        headers
      });

      console.log('📡 Respuesta del servidor:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error obteniendo token: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Token recibido:', data.success);
      
      if (data.success) {
        setClientToken(data.clientToken);
        setTestInfo({
          testCards: data.testCards,
          testNonces: data.testNonces
        });
        initializeBraintree(data.clientToken);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('❌ Error completo:', error);
      setMessage({ text: 'Error inicializando sistema de pagos: ' + error.message, type: 'error' });
      setLoading(false);
    }
  };

  const initializeBraintree = (token) => {
    if (!window.braintree) {
      console.warn('⏳ Script de Braintree aún no cargado, reintentando...');
      setTimeout(() => initializeBraintree(token), 100);
      return;
    }

    console.log('🎨 Inicializando Drop-in UI...');
    console.log('Token disponible:', token ? 'Sí (' + token.substring(0, 20) + '...)' : 'No');

    window.braintree.dropin.create({
      authorization: token,
      container: '#dropin-container',
      locale: 'es_ES',
      translations: {
        payingWith: 'Pagando con {{paymentSource}}',
        chooseAnotherWayToPay: 'Elegir otro método de pago',
        chooseAWayToPay: 'Elige un método de pago',
        otherWaysToPay: 'Otros métodos de pago',
        cardVerification: 'Verificación de tarjeta'
      },
      card: {
        overrides: {
          fields: {
            number: {
              placeholder: '4111 1111 1111 1111',
            },
            cvv: {
              placeholder: '123',
            },
            expirationDate: {
              placeholder: 'MM/YY',
            },
            postalCode: {
              placeholder: 'Código Postal'
            }
          }
        }
      }
    }, (err, dropinInstance) => {
      if (err) {
        console.error('❌ Error creando Drop-in:', err);
        console.error('Tipo de error:', typeof err);
        console.error('Mensaje:', err.message);
        console.error('Detalles completos:', JSON.stringify(err, null, 2));
        setMessage({ 
          text: `Error inicializando formulario de pago: ${err.message || JSON.stringify(err)}. Verifica las credenciales de Braintree.`, 
          type: 'error' 
        });
        setLoading(false);
        return;
      }
      console.log('✅ Drop-in creado exitosamente');
      setInstance(dropinInstance);
      setLoading(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!instance) {
      setMessage({ text: 'Sistema de pagos no inicializado', type: 'error' });
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      // Solicitar el nonce del método de pago
      const { nonce, deviceData } = await instance.requestPaymentMethod();

      // Enviar el nonce al backend
      const headers = {
        "X-Id-Rol": localStorage.getItem("id_rol") || "",
        "X-Id-Usuario": localStorage.getItem("id_usuario") || "",
        "Content-Type": "application/json",
      };

      const response = await fetch('http://localhost:5000/api/pagos/braintree/checkout', {
        method: 'POST',
        credentials: "include",
        headers,
        body: JSON.stringify({
          payment_method_nonce: nonce,
          amount: paymentData.amount,
          id_usuario: localStorage.getItem("id_usuario"),
          id_publicacion: paymentData.id_publicacion,
          device_data: deviceData
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          text: `¡Pago exitoso! ID de transacción: ${data.transaction.id}`, 
          type: 'success' 
        });
        
        // Mostrar detalles de la transacción
        console.log('Transacción completa:', data.transaction);
        
        // Redirigir después de un momento
        setTimeout(() => {
          navigate('/mis-compras');
        }, 3000);
      } else {
        setMessage({ 
          text: `Error en el pago: ${data.error}`, 
          type: 'error' 
        });
        
        if (data.errors && data.errors.length > 0) {
          console.error('Errores detallados:', data.errors);
        }
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      setMessage({ 
        text: 'Error procesando el pago: ' + error.message, 
        type: 'error' 
      });
    } finally {
      setProcessing(false);
    }
  };

  const loadTestInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pagos/braintree/test-info');
      const data = await response.json();
      setTestInfo(data);
      setShowTestInfo(true);
    } catch (error) {
      console.error('Error cargando información de prueba:', error);
    }
  };

  return (
    <div className="pago-tarjeta-container">
      <div className="pago-header">
        <button onClick={() => navigate(-1)} className="back-button">← Volver</button>
        <h1>Pago con Tarjeta</h1>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="pago-content">
        <div className="pago-details">
          <h2>Resumen del Pago</h2>
          <div className="detail-item">
            <span>Descripción:</span>
            <span>{paymentData.descripcion}</span>
          </div>
          <div className="detail-item total">
            <span>Total a pagar:</span>
            <span>${Number(paymentData.amount).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
          </div>

          {/* Información de prueba */}
          <div className="test-info-toggle">
            <button 
              onClick={() => setShowTestInfo(!showTestInfo)}
              className="btn-test-info"
            >
              {showTestInfo ? '🔒 Ocultar' : '🧪'} Información de Prueba
            </button>
          </div>

          {showTestInfo && testInfo && (
            <div className="test-info-panel">
              <h3>Tarjetas de Prueba</h3>
              <div className="test-cards">
                <div className="test-card-item">
                  <strong>Visa (Aprobada):</strong>
                  <code>4111 1111 1111 1111</code>
                </div>
                <div className="test-card-item">
                  <strong>Mastercard (Aprobada):</strong>
                  <code>5555 5555 5555 4444</code>
                </div>
                <div className="test-card-item">
                  <strong>Amex (Aprobada):</strong>
                  <code>3782 822463 10005</code>
                </div>
                <div className="test-card-item">
                  <strong>Visa (Rechazada):</strong>
                  <code>4000 1111 1111 1115</code>
                </div>
              </div>
              
              <h3>CVV de Prueba</h3>
              <ul className="test-list">
                <li><code>200</code> - No coincide (rechazado)</li>
                <li><code>201</code> - No verificado</li>
                <li><code>301</code> - Emisor no participa</li>
                <li>Cualquier otro - Coincide (aprobado)</li>
              </ul>

              <h3>Montos de Prueba</h3>
              <ul className="test-list">
                <li>$0.01 - $1,999.99 - Autorizado</li>
                <li>$2,000.00 - $2,999.99 - Rechazado</li>
                <li>$3,000.00 - $3,000.99 - Error</li>
              </ul>

              <p className="test-note">
                📝 Usa cualquier fecha de expiración futura y cualquier nombre
              </p>
            </div>
          )}
        </div>

        <div className="pago-form">
          <form onSubmit={handleSubmit}>
            {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando formulario de pago...</p>
              </div>
            )}
            
            <div id="dropin-container"></div>
            
            {!loading && (
              <button 
                type="submit" 
                className="btn-submit"
                disabled={processing}
              >
                {processing ? 'Procesando...' : `Pagar $${Number(paymentData.amount).toLocaleString('es-CO')}`}
              </button>
            )}
          </form>

          <div className="security-info">
            <p>🔒 Pago seguro procesado por Braintree (PayPal)</p>
            <p className="small">Tus datos están protegidos con encriptación SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagoTarjeta;
