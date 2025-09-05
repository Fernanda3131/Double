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
contrasena varchar(10),
talla varchar(5),
fecha_nacimiento date,
foto varchar(1000) not null,
id_rol int,
FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);


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
foto varchar(1000),
valor int,
id_publicacion int,
 FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion)
);


create table mensaje (
  id_mensaje int primary key auto_increment,
  id_emisor int,
  id_receptor int,
  contenido text,
  fecha_envio datetime,
  foreign key (id_emisor) references usuario(id_usuario),
  foreign key (id_receptor) references usuario(id_usuario)
);

create table pago (
  id_pago int primary key auto_increment,
  id_usuario int not null,
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
  usuario_valorador_id int,
  usuario_valorado_id int,
  puntaje int check (puntaje between 1 and 5),
  foreign key (usuario_valorador_id) references usuario(id_usuario),
  foreign key (usuario_valorado_id) references usuario(id_usuario)
);

insert into rol (nom_rol) VALUES
('Usuario'), ('Administrador');



insert into usuario (nombre, user_name, email, contrasena, talla, fecha_nacimiento, foto, id_rol) values
('Luisa Buitrago', 'luisa_B', 'luisa2000buitrago@gmail.com', 'fernanda', 'S', '2000-08-05', 'foto1.jpg',  1),
('Mateo Rojas', 'mateo_r', 'mateo@gmail.com', 'clave123', 'M', '1999-05-20', 'foto2.jpg', 1),
('Sofía López', 'sofia_l', 'sofia@gmail.com', 'clave123', 'L', '2001-07-30', 'foto3.jpg', 1),
('Tomás Díaz', 'tomas_d', 'tomas@gmail.com', 'clave123', 'XL', '1998-12-01', 'foto4.jpg', 1),
('Isabela Ruiz', 'isabela_r', 'isa@gmail.com', 'clave123', 'XS', '2003-03-12', 'foto5.jpg', 1),
('Samuel Torres', 'samuel_t', 'sam@gmail.com', 'clave123', 'XXL', '1997-09-11', 'foto6.jpg', 1),
('Camila Pérez', 'camila_p', 'cami@gmail.com', 'clave123', 'M', '2002-06-24', 'foto7.jpg', 1),
('Juan Castillo', 'juan_c', 'juan@gmail.com', 'clave123', 'L', '2000-10-10', 'foto8.jpg', 1),
('Daniela Vargas', 'daniela_v', 'daniela@gmail.com', 'clave123', 'S', '2001-02-02', 'foto9.jpg', 1),
('Andrés Mejía', 'andres_m', 'andres@gmail.com', 'clave123', 'XL', '1995-04-04', 'foto10.jpg', 1),
('Laura Acosta', 'laura_a', 'laura@gmail.com', 'clave123', 'XS', '2002-11-23', 'foto11.jpg', 1),
('Carlos Bernal', 'carlos_b', 'carlos@gmail.com', 'clave123', 'M', '2003-08-16', 'foto12.jpg', 1),
('Valentina Silva', 'valen_s', 'valen@gmail.com', 'clave123', 'S', '2000-03-03', 'foto13.jpg', 1),
('Felipe Moreno', 'felipe_m', 'felipe@gmail.com', 'clave123', 'L', '1998-05-06', 'foto14.jpg', 1),
('Mariana Flores', 'mariana_f', 'mari@gmail.com', 'clave123', 'XXL', '1997-10-17', 'foto15.jpg', 1),
('Julián Pardo', 'julian_p', 'julian@gmail.com', 'clave123', 'M', '1996-12-20', 'foto16.jpg', 1),
('Natalia Herrera', 'natalia_h', 'nata@gmail.com', 'clave123', 'S', '2004-01-01', 'foto17.jpg', 1),
('Sebastián Ramírez', 'sebastian_r', 'sebas@gmail.com', 'clave123', 'L', '1999-07-07', 'foto18.jpg', 1),
('Gabriela Orozco', 'gabriela_o', 'gaby@gmail.com', 'clave123', 'XL', '2001-09-09', 'foto19.jpg', 1),
('David Guzmán', 'david_g', 'david@gmail.com', 'clave123', 'XXL', '2000-06-06', 'foto20.jpg', 1);

select * from usuario;

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


insert into prenda (nombre, descripcion_prenda, talla, foto, valor, id_publicacion) values
('Top floral', 'Top con estampado floral ideal para primavera', 'S', 'top1.jpg', 15000, 1),
('Chaqueta gris', 'Chaqueta de algodón grueso, abrigadora', 'M', 'chaqueta1.jpg', 35000, 2),
('Falda plisada', 'Falda negra elegante, poco uso', 'S', 'falda1.jpg', 20000, 3),
('Blusa floreada', 'Blusa manga corta, fresca y cómoda', 'L', 'blusa1.jpg', 18000, 4),
('Jean clásico', 'Pantalón de mezclilla con corte recto', 'XL', 'jean1.jpg', 25000, 5),
('Vestido noche', 'Vestido largo con detalles brillantes', 'M', 'vestido1.jpg', 60000, 6),
('Camisa casual', 'Camisa manga larga ideal para oficina', 'L', 'camisa1.jpg', 22000, 7),
('Jeans rasgados', 'Jeans estilo urbano con rotos', 'S', 'jeans2.jpg', 30000, 8),
('Sudadera comfy', 'Sudadera oversize súper cómoda', 'XXL', 'sudadera1.jpg', 28000, 9),
('Blazer azul', 'Blazer elegante para eventos formales', 'XS', 'blazer1.jpg', 45000, 10),
('Short deportivo', 'Short de secado rápido ideal para deporte', 'M', 'short1.jpg', 16000, 11),
('Prenda upcycling', 'Diseño exclusivo a partir de otras prendas', 'L', 'reciclado1.jpg', 20000, 12),
('Camiseta retro', 'Camiseta con diseño vintage de los 90s', 'XL', 'camiseta1.jpg', 19000, 13),
('Chamarra lluvia', 'Chamarra impermeable ligera', 'S', 'chamarra1.jpg', 27000, 14),
('Overol floral', 'Overol con estampado y bolsillos', 'M', 'overol1.jpg', 32000, 15),
('Pantalón formal', 'Pantalón ideal para entrevistas y oficina', 'L', 'pantalon1.jpg', 30000, 16),
('Camiseta básica', 'Camiseta blanca ideal para combinar', 'M', 'camiseta2.jpg', 10000, 17),
('Chaqueta cuero', 'Chaqueta de cuero sintético, elegante', 'XL', 'chaqueta2.jpg', 50000, 18),
('Vestido casual', 'Vestido corto con flores', 'XS', 'vestido2.jpg', 23000, 19),
('Blusa sin mangas', 'Blusa fresca, sin mangas, color clara', 'S', 'blusa2.jpg', 17000, 20);

select * from prenda;

insert into mensaje (id_emisor, id_receptor, contenido, fecha_envio) values
(1, 2, 'Hola Mateo, ¿quieres intercambiar ropa?', '2025-06-23 10:00:00'),
(2, 1, 'Hola Luisa, claro que sí. ¿Cuál tienes?', '2025-06-23 10:03:00'),
(3, 4, 'Hola Tomás, vi tu blazer publicado, ¿aún disponible?', '2025-06-22 08:30:00'),
(4, 3, 'Hola Sofía, sí, está disponible.', '2025-06-22 08:33:00'),
(5, 6, 'Samuel, ¿puedes enviarme más fotos de tu prenda?', '2025-06-21 15:00:00'),
(6, 5, 'Claro Isa, ya te las mando.', '2025-06-21 15:05:00'),
(7, 8, 'Juan, me interesa tu chaqueta M.', '2025-06-20 13:15:00'),
(8, 7, 'Hola Camila, está reservada, pero te aviso si se libera.', '2025-06-20 13:18:00'),
(9, 10, 'Andrés, ¿envías a otras ciudades?', '2025-06-19 17:00:00'),
(10, 9, 'Sí Daniela, hacemos envíos.', '2025-06-19 17:03:00'),
(11, 12, 'Carlos, me interesa tu pantalón.', '2025-06-18 11:45:00'),
(12, 11, 'Laura, te lo puedo guardar hasta mañana.', '2025-06-18 11:50:00'),
(13, 14, 'Felipe, ¿aceptas intercambio?', '2025-06-17 19:00:00'),
(14, 13, 'Sí Valentina, ¿qué prenda tienes?', '2025-06-17 19:05:00'),
(15, 16, 'Julián, ¿cuánto vale tu sudadera?', '2025-06-16 14:30:00'),
(16, 15, 'Vale 40.000 COP.', '2025-06-16 14:33:00'),
(17, 18, 'Sebastián, ¿puedo pasar a recogerla hoy?', '2025-06-15 10:00:00'),
(18, 17, 'Sí Natalia, después de las 5 p.m.', '2025-06-15 10:05:00'),
(19, 20, 'David, ¿haces cambios?', '2025-06-14 12:00:00'),
(20, 19, 'Hola Gabriela, solo venta por ahora.', '2025-06-14 12:04:00');

select * from mensaje;

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
insert into valoracion (usuario_valorador_id, usuario_valorado_id, puntaje) values
(2, 1, 5),
(3, 1, 4),
(4, 2, 5),
(5, 3, 3),
(6, 4, 4),
(7, 5, 5),
(8, 6, 4),
(9, 7, 5),
(10, 8, 3),
(11, 9, 4),
(12, 10, 2),
(13, 11, 5),
(14, 12, 4),
(15, 13, 5),
(16, 14, 3),
(17, 15, 5),
(18, 16, 4),
(19, 17, 5),
(20, 18, 3),
(1, 19, 4);



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





