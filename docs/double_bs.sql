create database Double_P;
use Double_P;

Create table rol (
id_rol int primary key auto_increment,
nom_rol varchar(100)
);
 

create table usuario (
id_usuario int primary key auto_increment,
nombre varchar(100),
username varchar(100),
email varchar(100),
contrasena VARCHAR(255),
talla varchar(5),
fecha_nacimiento date,
foto varchar(1000) not null,
id_rol int,
FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

select contrasena from usuario where id_usuario = 22;
create table publicacion (
id_publicacion int primary key auto_increment,
descripcion text,
estado ENUM("Disponible", "No Disponible"),
tipo_publicacion ENUM("Venta", "Intercambio"),
fecha_publicacion date,
id_usuario int,
foreign key (id_usuario) references usuario(id_usuario)
);

create table prenda (
id_prenda int primary key auto_increment,
nombre varchar(100),
descripcion_prenda text,
talla varchar(10),
foto varchar(1000) NULL,
foto2 varchar(1000) NULL,
foto3 varchar(1000) NULL,
foto4 varchar(1000) NULL,
valor int,
id_publicacion int,
 FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion)
);

create table pago (
  id_pago int primary key auto_increment,
  id_usuario int not null
  ,
  id_publicacion int not null,
  monto int,
  metodo_pago enum("Nequi", "Daviplata", "PSE", "Efecty", "Bancolombia", "Visa", "MasterCard", "Codensa", "Davivienda", "Av Villas"),
  estado_pago enum("PENDIENTE", "PROCESO", "COMPLETADO"),
  fecha_pago datetime,
  foreign key (id_usuario) references usuario(id_usuario),
  foreign key (id_publicacion) references publicacion(id_publicacion)
);


create table valoracion (
  id_valoracion int primary key auto_increment,
  usuario_valorado_id int,
  puntaje int check (puntaje between 1 and 5),
  foreign key (usuario_valorado_id) references usuario(id_usuario)
);

insert into rol (nom_rol) VALUES
('Administrador'), ('Usuario');

select * from usuario;


insert into usuario (nombre, username, email, contrasena, talla, fecha_nacimiento, foto, id_rol) values
('Luisa Buitrago', 'luisa_B', 'luisa2000buitrago@gmail.com', 'fernanda', 'S', '2000-08-05', 'fernandita.jpg',  2),
('Mateo Rojas', 'mateo_r', 'mateo@gmail.com', 'clave123', 'M', '1999-05-20', 'foto2.jpg', 2),
('Sofía López', 'sofia_l', 'sofia@gmail.com', 'clave123', 'L', '2001-07-30', 'foto3.jpg', 2),
('Tomás Díaz', 'tomas_d', 'tomas@gmail.com', 'clave123', 'XL', '1998-12-01', 'foto4.jpg', 2),
('Isabela Ruiz', 'isabela_r', 'isa@gmail.com', 'clave123', 'XS', '2003-03-12', 'foto5.jpg', 2),
('Samuel Torres', 'samuel_t', 'sam@gmail.com', 'clave123', 'XXL', '1997-09-11', 'foto6.jpg', 2),
('Camila Pérez', 'camila_p', 'cami@gmail.com', 'clave123', 'M', '2002-06-24', 'foto7.jpg', 2),
('Juan Castillo', 'juan_c', 'juan@gmail.com', 'clave123', 'L', '2000-10-10', 'foto8.jpg', 2),
('Daniela Vargas', 'daniela_v', 'daniela@gmail.com', 'clave123', 'S', '2001-02-02', 'foto9.jpg', 2),
('Andrés Mejía', 'andres_m', 'andres@gmail.com', 'clave123', 'XL', '1995-04-04', 'foto10.jpg', 2),
('Laura Acosta', 'laura_a', 'laura@gmail.com', 'clave123', 'XS', '2002-11-23', 'foto11.jpg', 2),
('Carlos Bernal', 'carlos_b', 'carlos@gmail.com', 'clave123', 'M', '2003-08-16', 'foto12.jpg', 2),
('Valentina Silva', 'valen_s', 'valen@gmail.com', 'clave123', 'S', '2000-03-03', 'foto13.jpg', 2),
('Felipe Moreno', 'felipe_m', 'felipe@gmail.com', 'clave123', 'L', '1998-05-06', 'foto14.jpg', 2),
('Mariana Flores', 'mariana_f', 'mari@gmail.com', 'clave123', 'XXL', '1997-10-17', 'foto15.jpg', 2),
('Julián Pardo', 'julian_p', 'julian@gmail.com', 'clave123', 'M', '1996-12-20', 'foto16.jpg', 2),
('Natalia Herrera', 'natalia_h', 'nata@gmail.com', 'clave123', 'S', '2004-01-01', 'foto17.jpg', 2),
('Sebastián Ramírez', 'sebastian_r', 'sebas@gmail.com', 'clave123', 'L', '1999-07-07', 'foto18.jpg', 2),
('Gabriela Orozco', 'gabriela_o', 'gaby@gmail.com', 'clave123', 'XL', '2001-09-09', 'foto19.jpg', 2),
('David Guzmán', 'david_g', 'david@gmail.com', 'clave123', 'XXL', '2000-06-06', 'foto20.jpg', 2);







INSERT INTO publicacion (descripcion, estado, tipo_publicacion, fecha_publicacion, id_usuario) VALUES
('Prenda talla xs con remiendos en la cintura', 'Disponible', 'Venta', '2025-06-06', 1),
('Chaqueta talla M en buen estado', 'Disponible', 'Intercambio', '2025-06-19', 2),
('Falda color negro talla S con poco uso', 'Disponible', 'Venta', '2025-06-20', 3),
('Blusa floral talla L ligeramente usada', 'No disponible', 'Venta', '2025-06-21', 4),
('Pantalón de mezclilla talla XL, nuevo', 'Disponible', 'Intercambio', '2025-06-18', 5),
('Vestido de fiesta talla M con lentejuelas', 'Disponible', 'Venta', '2025-06-19', 1),
('Camisa manga larga talla L', 'Disponible', 'Intercambio', '2025-06-20', 2),
('Jeans ajustados talla S rotos estilo moda', 'No disponible', 'Venta', '2025-06-18', 3),
('Sudadera oversize talla XXL', 'Disponible', 'Intercambio', '2025-06-21', 4),
('Blazer elegante talla XS', 'Disponible', 'Venta', '2025-06-20', 5),
('Shorts deportivos talla M en excelente estado', 'Disponible', 'Intercambio', '2025-06-19', 1),
('Prenda reciclada con diseño único talla L', 'Disponible', 'Venta', '2025-06-20', 2),
('Camiseta vintage talla XL', 'No disponible', 'Venta', '2025-06-22', 3),
('Chamarra impermeable talla S', 'Disponible', 'Intercambio', '2025-06-23', 4),
('Overol talla M con estampado', 'Disponible', 'Venta', '2025-06-19', 5),
('Pantalón formal talla L para eventos', 'Disponible', 'Intercambio', '2025-06-18', 1),
('Camiseta básica blanca talla M', 'No disponible', 'Venta', '2025-06-20', 2),
('Chaqueta de cuero talla XL usada', 'Disponible', 'Intercambio', '2025-06-21', 3),
('Vestido casual talla XS con flores', 'Disponible', 'Venta', '2025-06-22', 4),
('Blusa sin mangas talla S nueva', 'Disponible', 'Intercambio', '2025-06-23', 5);



INSERT INTO prenda 
(nombre, descripcion_prenda, talla, foto, foto2, foto3, foto4, valor, id_publicacion) VALUES
('Top floral', 'Top con estampado floral ideal para primavera', 'S', 'top1.jpg', 'top2.jpg', 'top3.jpg', 'top4.jpg', 15000, 1),
('Chaqueta gris', 'Chaqueta de algodón grueso, abrigadora', 'M', 'chaqueta1.jpg', 'chaqueta2.jpg', 'chaqueta3.jpg', 'chaqueta4.jpg', 35000, 2),
('Falda plisada', 'Falda negra elegante, poco uso', 'S', 'falda1.jpg', 'falda2.jpg', 'falda3.jpg', 'falda4.jpg', 20000, 3),
('Blusa floreada', 'Blusa manga corta, fresca y cómoda', 'L', 'blusa1.jpg', 'blusa2.jpg', 'blusa3.jpg', 'blusa4.jpg', 18000, 4),
('Jean clásico', 'Pantalón de mezclilla con corte recto', 'XL', 'jean1.jpg', 'jean2.jpg', 'jean3.jpg', 'jean4.jpg', 25000, 5),
('Vestido noche', 'Vestido largo con detalles brillantes', 'M', 'vestido1.jpg', 'vestido2.jpg', 'vestido3.jpg', 'vestido4.jpg', 60000, 6),
('Camisa casual', 'Camisa manga larga ideal para oficina', 'L', 'camisa1.jpg', 'camisa2.jpg', 'camisa3.jpg', 'camisa4.jpg', 22000, 7),
('Jeans rasgados', 'Jeans estilo urbano con rotos', 'S', 'jeansrotos.jpg', 'jeansrotos2.jpg', 'jeansrotos3.jpg', 'jeansrotos4.jpg', 30000, 8),
('Sudadera comfy', 'Sudadera oversize súper cómoda', 'XXL', 'sudadera1.jpg', 'sudadera2.jpg', 'sudadera3.jpg', 'sudadera4.jpg', 28000, 9),
('Blazer azul', 'Blazer elegante para eventos formales', 'XS', 'blazer1.jpg', 'blazer2.jpg', 'blazer3.jpg', 'blazer4.jpg', 45000, 10),
('Short deportivo', 'Short de secado rápido ideal para deporte', 'M', 'short1.jpg', 'short2.jpg', 'short3.jpg', 'short4.jpg', 16000, 11),
('Prenda upcycling', 'Diseño exclusivo a partir de otras prendas', 'L', 'reciclado1.jpg', 'reciclado2.jpg', 'reciclado3.jpg', 'reciclado4.jpg', 20000, 12),
('Camiseta retro', 'Camiseta con diseño vintage de los 90s', 'XL', 'camisetaa1.jpg', 'camisetaa2.jpg', 'camisetaa3.jpg', 'camisetaa4.jpg', 19000, 13),
('Chamarra lluvia', 'Chamarra impermeable ligera', 'S', 'chamarra1.jpg', 'chamarra2.jpg', 'chamarra3.jpg', 'chamarra4.jpg', 27000, 14),
('Overol floral', 'Overol con estampado y bolsillos', 'M', 'overol1.jpg', 'overol2.jpg', 'overol3.jpg', 'overol4.jpg', 32000, 15),
('Pantalón formal', 'Pantalón ideal para entrevistas y oficina', 'L', 'pantalon1.jpg', 'pantalon2.jpg', 'pantalon3.jpg', 'pantalon4.jpg', 30000, 16),
('Camiseta básica', 'Camiseta blanca ideal para combinar', 'M', 'camisetas1.jpg', 'camisetas2.jpg', 'camisetas3.jpg', 'camisetas4.jpg', 10000, 17),
('Chaqueta cuero', 'Chaqueta de cuero sintético, elegante', 'XL', 'chaquetas2.jpg', 'chaquetas3.jpg', 'chaquetas4.jpg', 'chaquetas5.jpg', 50000, 18),
('Vestido casual', 'Vestido corto con flores', 'XS', 'vestidos2.jpg', 'vestidos3.jpg', 'vestidos4.jpg', 'vestidos5.jpg', 23000, 19),
('Blusa sin mangas', 'Blusa fresca, sin mangas, color clara', 'S', 'blusas2.jpg', 'blusas3.jpg', 'blusas4.jpg', 'blusas5.jpg', 17000, 20);



select * from prenda;




INSERT INTO pago (id_pago, id_usuario, id_publicacion, monto, metodo_pago, estado_pago, fecha_pago) VALUES
(1, 1, 1,5000, 'Nequi', 'COMPLETADO', '2025-06-18 09:00:00'),
(2, 2, 2, 5000, 'Daviplata', 'COMPLETADO', '2025-06-19 10:30:00'),
(3, 3, 3, 5000, 'PSE', 'COMPLETADO', '2025-06-20 11:00:00'),
(4, 4, 4, 5000, 'Efecty', 'COMPLETADO', '2025-06-21 12:00:00'),
(5, 5, 5, 5000, 'Bancolombia', 'COMPLETADO', '2025-06-18 13:00:00'),
(6, 6, 6, 5000, 'Visa', 'COMPLETADO', '2025-06-19 14:00:00'),
(7, 7, 7, 5000, 'MasterCard', 'COMPLETADO', '2025-06-20 15:00:00'),
(8, 8, 8, 5000, 'Codensa', 'COMPLETADO', '2025-06-18 16:00:00'),
(9, 9, 9, 5000, 'Davivienda', 'COMPLETADO', '2025-06-21 17:00:00'),
(10, 10, 10, 5000, 'Av Villas', 'COMPLETADO', '2025-06-20 18:00:00'),
(11, 11, 11, 5000, 'Nequi', 'COMPLETADO', '2025-06-19 19:00:00'),
(12, 12, 12, 5000, 'Daviplata', 'COMPLETADO', '2025-06-20 20:00:00'),
(13, 13, 13, 5000, 'PSE', 'COMPLETADO', '2025-06-22 09:00:00'),
(14, 14, 14, 5000, 'Efecty', 'COMPLETADO', '2025-06-23 10:00:00'),
(15, 15, 15, 5000, 'Bancolombia', 'COMPLETADO', '2025-06-19 11:00:00'),
(16, 16, 16, 5000, 'Visa', 'COMPLETADO', '2025-06-18 12:00:00'),
(17, 17, 17, 5000, 'MasterCard', 'COMPLETADO', '2025-06-20 13:00:00'),
(18, 18, 18, 5000, 'Codensa', 'COMPLETADO', '2025-06-21 14:00:00'),
(19, 19, 19, 5000, 'Davivienda', 'COMPLETADO', '2025-06-22 15:00:00'),
(20, 20, 20, 5000, 'Av Villas', 'COMPLETADO', '2025-06-23 16:00:00');


select * from pago;
select * from valoracion;
insert into valoracion (usuario_valorado_id, puntaje) values
(1, 5),
(1, 4),
(2, 5),
(3, 3),
(4, 4),
(5, 5),
(6, 4),
(7, 5),
(8, 3),
(9, 4),
(10, 2),
(11, 5),
(12, 4),
(13, 5),
(14, 3),
(15, 5),
(16, 4),
(17, 5),
(18, 3),
(19, 4);


#triggers Qué es un trigger?
#Un trigger (o disparador) es una acción automática que se ejecuta en tu base de datos cuando ocurre algo en una tabla
#(como un INSERT, UPDATE o DELETE).
#Ejemplo en la vida ral:
#Imagina que tienes un botón en tu puerta que automáticamente prende una luz cada vez que alguien entra.
#Ese botón es el trigger, y prender la luz es la acción automática.
#¿Cuándo se usan los triggers?
#Para llenar campos automáticamente (como la fecha de creación).
#Para evitar errores (como insertar una publicación sin descripción).
#Para guardar registros de cambios (como quién fue eliminado).

/*Procedimientos almacenados para el actualizar el perfil del usuario*/

DELIMITER $$

CREATE PROCEDURE actualizar_perfil(
    IN p_id_usuario INT,
    IN p_talla VARCHAR(10),
    IN p_foto VARCHAR(255),
    IN p_contrasena VARCHAR(100)
)
BEGIN
    UPDATE usuario
    SET talla = p_talla,
        foto = p_foto,
        contrasena = p_contrasena
    WHERE id_usuario = p_id_usuario;
END $$

DELIMITER ;

/* VISTA PUBLICACIONES*/
CREATE VIEW vista_publicaciones AS
SELECT 
    p.id_publicacion,
    p.descripcion AS descripcion_publicacion,
    p.estado,
    p.tipo_publicacion,
    p.fecha_publicacion,
    pr.id_prenda,
    pr.nombre AS nombre_prenda,
    pr.descripcion_prenda,
    pr.talla,
    pr.foto,
    pr.valor,
    p.id_usuario
FROM publicacion p
JOIN prenda pr ON p.id_publicacion = pr.id_publicacion;

SELECT * FROM vista_publicaciones;
SHOW FULL TABLES WHERE Table_type = 'VIEW';



select * from vista_publicaciones where id_publicacion = 1;
/* VISTA VALORACIÓN*/
CREATE VIEW vista_valoracion AS
SELECT 
    u.id_usuario,
    u.nombre AS nombre_usuario,
    AVG(v.puntaje) AS promedio_valoracion
FROM usuario u
LEFT JOIN valoracion v 
       ON u.id_usuario = v.usuario_valorado_id
GROUP BY u.id_usuario, u.nombre;


/* VISTA MI PERFIL*/
CREATE VIEW vista_mi_perfil AS
SELECT 
    u.id_usuario,
    u.nombre AS nombre_usuario,
    u.username AS username_usuario,
    u.foto AS foto_usuario,
    p.id_publicacion,
    pr.id_prenda,
    pr.nombre AS nombre_prenda,
	pr.foto AS foto_prenda,
    vv.promedio_valoracion
FROM usuario u
JOIN publicacion p ON u.id_usuario = p.id_usuario
JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
LEFT JOIN (
    SELECT 
        v.usuario_valorado_id,
        AVG(v.puntaje) AS promedio_valoracion
    FROM valoracion v
    GROUP BY v.usuario_valorado_id
) vv ON u.id_usuario = vv.usuario_valorado_id;



CREATE VIEW vista_valoracion AS
SELECT 
    u.id_usuario,
    u.nombre AS nombre_usuario,
    AVG(v.puntaje) AS promedio_valoracion
FROM usuario u
LEFT JOIN valoracion v 
       ON u.id_usuario = v.usuario_valorado_id
GROUP BY u.id_usuario, u.nombre;

select * from valoracion where usuario_valorado_id = 1;

/* VISTA OTROS PERFIL*/
CREATE VIEW vista_otros_perfiles AS
SELECT 
    u.id_usuario,
    u.username AS username_usuario,
    u.foto AS foto_usuario,
    p.id_publicacion,
    pr.id_prenda,
    pr.nombre AS nombre_prenda,
	pr.foto AS foto_prenda,
    vv.promedio_valoracion
FROM usuario u
JOIN publicacion p ON u.id_usuario = p.id_usuario
JOIN prenda pr ON p.id_publicacion = pr.id_publicacion
LEFT JOIN (
    SELECT 
        v.usuario_valorado_id,
        AVG(v.puntaje) AS promedio_valoracion
    FROM valoracion v
    GROUP BY v.usuario_valorado_id
) vv ON u.id_usuario = vv.usuario_valorado_id;


DELIMITER $$


CREATE PROCEDURE crear_publicacion_prenda (
    IN p_descripcion TEXT,
    IN p_estado VARCHAR(50),
    IN p_tipo_publicacion VARCHAR(50),
    IN p_fecha_publicacion DATE,
    IN p_id_usuario INT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion_prenda TEXT,
    IN p_talla VARCHAR(10),
    IN p_foto VARCHAR(255),
    IN p_foto2 VARCHAR(255),
    IN p_foto3 VARCHAR(255),
    IN p_foto4 VARCHAR(255),
    IN p_valor DECIMAL(10,2)
)
BEGIN
    -- Primero insertamos la publicación
    INSERT INTO publicacion (descripcion, estado, tipo_publicacion, fecha_publicacion, id_usuario)
    VALUES (p_descripcion, p_estado, p_tipo_publicacion, p_fecha_publicacion, p_id_usuario);

    -- Obtenemos el id generado de la publicación
    SET @last_id_publicacion = LAST_INSERT_ID();

    -- Insertamos la prenda asociada a esa publicación
    INSERT INTO prenda (nombre, descripcion_prenda, talla, foto, foto2, foto3, foto4, valor, id_publicacion)
    VALUES (p_nombre, p_descripcion_prenda, p_talla, p_foto, p_foto2, p_foto3, p_foto4, p_valor, @last_id_publicacion);
END$$

DELIMITER ;


ALTER TABLE usuario
ADD CONSTRAINT unique_username UNIQUE (username);

ALTER TABLE usuario
ADD COLUMN creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE OR REPLACE VIEW detalle_prenda AS
SELECT 
    p.id_prenda,
    p.nombre,
    u.username,
    u.id_usuario,
    pub.descripcion,
    p.talla,
    p.foto,
    p.foto2,
    p.foto3,
    p.foto4,
    p.valor,
    pub.tipo_publicacion
FROM prenda p
INNER JOIN publicacion pub ON p.id_publicacion = pub.id_publicacion
INNER JOIN usuario u ON pub.id_usuario = u.id_usuario;

SELECT * FROM detalle_prenda;
-- PANEL ADMINISTRADOR 
/*Total de usuarios*/
CREATE OR REPLACE VIEW vista_total_usuarios AS
SELECT COUNT(*) AS total_usuarios
FROM usuario;

/* Total de publicaciones activas*/
CREATE OR REPLACE VIEW vista_publicaciones_activas AS
SELECT COUNT(*) AS publicaciones_activas
FROM publicacion
WHERE estado = 'Disponible';

/*N° USUARIOS*/
CREATE OR REPLACE VIEW vista_numero_usuarios AS
SELECT COUNT(*) AS numero_usuarios
FROM usuario
WHERE id_rol = 2;

/*N° ADMINISTRADORES*/
CREATE OR REPLACE VIEW vista_numero_administradores AS
SELECT COUNT(*) AS numero_administradores
FROM usuario
WHERE id_rol = 1;

	
