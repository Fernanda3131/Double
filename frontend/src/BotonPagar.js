import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BotonPagar.css';

/**
 * Componente de botón para iniciar el proceso de pago con Braintree
 * 
 * @param {Object} props
 * @param {number} props.amount - Monto a pagar
 * @param {number} props.id_publicacion - ID de la publicación
 * @param {string} props.descripcion - Descripción del pago
 * @param {string} props.className - Clase CSS adicional
 * @param {function} props.onBeforePay - Callback antes de navegar al pago
 */
function BotonPagar({ 
  amount, 
  id_publicacion, 
  descripcion = 'Compra de prenda',
  className = '',
  onBeforePay = null 
}) {
  const navigate = useNavigate();

  const handlePay = () => {
    // Validar datos
    if (!amount || amount <= 0) {
      alert('Monto inválido');
      return;
    }

    // Callback personalizado antes de pagar (ej: validaciones)
    if (onBeforePay) {
      const canProceed = onBeforePay();
      if (!canProceed) return;
    }

    // Navegar a la página de pago con los datos
    navigate('/pago-tarjeta', {
      state: {
        amount: parseFloat(amount),
        id_publicacion: id_publicacion,
        descripcion: descripcion
      }
    });
  };

  return (
    <button 
      onClick={handlePay}
      className={`boton-pagar ${className}`}
    >
      💳 Pagar ${Number(amount).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
    </button>
  );
}

export default BotonPagar;