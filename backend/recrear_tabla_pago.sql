-- Script para recrear completamente la tabla pago
-- Este script elimina y recrea la tabla desde cero

USE pipidb;

-- Desactivar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tabla si existe
DROP TABLE IF EXISTS pago;

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Crear tabla nueva con todos los campos
CREATE TABLE pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_comprador INT NOT NULL,
    id_usuario_vendedor INT NOT NULL,
    id_publicacion INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'braintree',
    estado_pago VARCHAR(50) DEFAULT 'pendiente',
    transaction_id VARCHAR(255) NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    processor_response_code VARCHAR(10) NULL,
    processor_response_text VARCHAR(255) NULL,
    avs_postal_code_response VARCHAR(2) NULL,
    avs_street_address_response VARCHAR(2) NULL,
    cvv_response_code VARCHAR(2) NULL,
    card_type VARCHAR(50) NULL,
    last_4_digits VARCHAR(4) NULL,
    CONSTRAINT fk_pago_comprador FOREIGN KEY (id_usuario_comprador) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_pago_vendedor FOREIGN KEY (id_usuario_vendedor) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_pago_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crear índices
CREATE INDEX idx_transaction_id ON pago(transaction_id);
CREATE INDEX idx_usuario_comprador ON pago(id_usuario_comprador);
CREATE INDEX idx_usuario_vendedor ON pago(id_usuario_vendedor);
CREATE INDEX idx_publicacion ON pago(id_publicacion);
CREATE INDEX idx_estado_pago ON pago(estado_pago);

-- Verificar estructura
DESCRIBE pago;

SELECT 'Tabla pago recreada exitosamente' AS Resultado;
