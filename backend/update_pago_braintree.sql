-- Script para actualizar la tabla pago con campos de Braintree
-- Ejecutar en MySQL antes de usar la integración de Braintree

USE pipidb;  -- Cambiar por el nombre de tu base de datos

-- Verificar si la tabla existe y eliminarla (CUIDADO: esto borra todos los datos)
-- Si quieres conservar los datos, comenta las siguientes dos líneas
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS pago;
SET FOREIGN_KEY_CHECKS = 1;

-- Crear tabla con nueva estructura
CREATE TABLE pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_comprador INT NOT NULL,
    id_usuario_vendedor INT NOT NULL,
    id_publicacion INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'braintree',
    estado_pago VARCHAR(50) DEFAULT 'pendiente',
    transaction_id VARCHAR(255),
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Campos adicionales de Braintree
    processor_response_code VARCHAR(10) NULL COMMENT 'Código de respuesta del procesador',
    processor_response_text VARCHAR(255) NULL COMMENT 'Texto de respuesta del procesador',
    avs_postal_code_response VARCHAR(2) NULL COMMENT 'Respuesta AVS para código postal (M/N/U/I)',
    avs_street_address_response VARCHAR(2) NULL COMMENT 'Respuesta AVS para dirección (M/N/U/I)',
    cvv_response_code VARCHAR(2) NULL COMMENT 'Respuesta CVV (M/N/U/S/I)',
    card_type VARCHAR(50) NULL COMMENT 'Tipo de tarjeta (Visa, Mastercard, etc)',
    last_4_digits VARCHAR(4) NULL COMMENT 'Últimos 4 dígitos de la tarjeta',
    
    FOREIGN KEY (id_usuario_comprador) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_vendedor) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_transaction_id ON pago(transaction_id);
CREATE INDEX idx_usuario_comprador ON pago(id_usuario_comprador);
CREATE INDEX idx_usuario_vendedor ON pago(id_usuario_vendedor);
CREATE INDEX idx_publicacion ON pago(id_publicacion);
CREATE INDEX idx_estado_pago ON pago(estado_pago);
CREATE INDEX idx_fecha_pago ON pago(fecha_pago);

-- Mostrar estructura actualizada
DESCRIBE pago;

-- Mostrar mensaje de confirmación
SELECT 'Tabla pago creada exitosamente con estructura de Braintree' AS Mensaje;

-- Información sobre códigos de respuesta
/*
AVS POSTAL CODE RESPONSES:
- M: Coincide
- N: No coincide
- U: No verificado
- I: No proporcionado

AVS STREET ADDRESS RESPONSES:
- M: Coincide
- N: No coincide (usar número de calle 200)
- U: No verificado (usar número de calle 201)
- I: No proporcionado

CVV RESPONSE CODES:
- M: Coincide
- N: No coincide (usar CVV 200)
- U: No verificado (usar CVV 201)
- S: Emisor no participa (usar CVV 301)
- I: No proporcionado

PROCESSOR RESPONSE CODES:
- 1000: Aprobado
- 2000-2999: Rechazado por procesador
- 3000: Error del procesador

Para más información sobre testing:
https://developer.paypal.com/braintree/docs/reference/general/testing/ruby#avs-and-cvv/cid-responses
*/
