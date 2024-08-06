DROP DATABASE IF EXISTS GestionInventario;
CREATE DATABASE GestionInventario;
USE GestionInventario;

CREATE TABLE Usuario (
    cve_usuario     INT AUTO_INCREMENT PRIMARY KEY,
    usuario         VARCHAR(20),
    password        VARCHAR(20),
    token           VARCHAR(100),
    a_paterno       VARCHAR(100),
    a_materno       VARCHAR(100),
    nombre          VARCHAR(100),
    rol             VARCHAR(100),
    extension       INT,
    email           VARCHAR(100)
);

CREATE TABLE Proyectos (
    cve_proyecto    INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)
);

CREATE TABLE Articulos (
    id_articulo         INT PRIMARY KEY AUTO_INCREMENT,
    clave_articulo      VARCHAR(60),
    adision             INT,
    Descripcion         VARCHAR(100),
    Modelo              VARCHAR(25),
    Marca               VARCHAR(20),
    Num_Serie           VARCHAR(20),
    Estatus             VARCHAR(30),
    Responsable         VARCHAR(100),
    Cuenta              INT
);

CREATE TABLE Lugares (
    cve_lugar       INT AUTO_INCREMENT PRIMARY KEY,
    Ubicacion       VARCHAR(50),
    Nombre          VARCHAR(50)
);

CREATE TABLE Prestamos (
    cve_prestamo            INT AUTO_INCREMENT PRIMARY KEY,
    usuario                 VARCHAR(100),
    correo                  VARCHAR(100),
    rol                     VARCHAR(100),
    lugarDeUso              varchar(100),
    ProyectoApoyo           varchar(100),
    Fecha_salida            DATE,
    Fecha_vencimiento       DATE,
    Fecha_devolucion        DATE
);

CREATE TABLE PrestamoArticulos (
    cve_prestamo    INT,
    id_articulo     INT,
    DescripcionArticulo VARCHAR(100),
    cve_articulo    VARCHAR(100),
    
    PRIMARY KEY (cve_prestamo, id_articulo),
    FOREIGN KEY (cve_prestamo) REFERENCES Prestamos(cve_prestamo),
    FOREIGN KEY (id_articulo) REFERENCES Articulos(id_articulo)
);
