-- ******************************************************************************************************************
-- PROYECTO: Vasir
-- DESCRIPCIÓN: Creación de tablas, procedimientos almacenados y objetos de datos que usa la aplicación
-- LENGUAJE: T-SQL 
-- DESARROLLADOR: DAVID FELIPE MORALES GIL
-- MODIFICACIONES: Ninguna, primera versión
-- ******************************************************************************************************************


-- ******************************************************************************************************************
-- BASE DE DATOS MASTER PARA VALIDAR LA EXISTENCIA DE ASGARD
USE Master
-- ******************************************************************************************************************


-- ******************************************************************************************************************
-- CREA LA BASE DE DATOS
IF OBJECT_ID ('Asgard.dbo.Driver', 'U') IS NOT NULL DROP DATABASE Asgard

CREATE DATABASE Asgard
USE Asgard
-- ******************************************************************************************************************


-- ******************************************************************************************************************
-- CREA TABLAS PRINCIPALES
CREATE TABLE Driver  (Id INT IDENTITY (1,1) PRIMARY KEY,
					  Nombre VARCHAR(255) NOT NULL,
					  Usuario VARCHAR(75) NOT NULL,
					  Correo VARCHAR(255) NOT NULL,
					  Telefono BIGINT NOT NULL,
					  Contrasena VARCHAR(255) NOT NULL,
					  ConfirmaContraseña VARCHAR(255) NOT NULL,
					  TermsYCondic BIT NOT NULL)

CREATE TABLE InfoDriverDetails (Id INT IDENTITY (1,1) PRIMARY KEY,
								IdDriver INT NOT NULL,
								Licencia VARCHAR(75) NOT NULL,
								FechExpLicencia DATE NOT NULL,
								Tecnomecanica VARCHAR(75) NOT NULL,
								FechUltRevision DATE NOT NULL)

CREATE TABLE Vehicules (Id INT IDENTITY (1,1) PRIMARY KEY,
						Consecionario VARCHAR(25) NOT NULL,
						Referencia VARCHAR(75) NOT NULL,
						Modelo VARCHAR(25) NOT NULL
						)

CREATE TABLE AddVehicule (Id INT IDENTITY (1,1) PRIMARY KEY,
						  IdDriver INT NOT NULL,
						  IdVehicules INT,
						  TipoVehiculo VARCHAR(25) NOT NULL,
						  Marca VARCHAR(25) NOT NULL,
						  Referencia VARCHAR(75) NOT NULL,
						  Modelo INT NOT NULL,
						  Placa VARCHAR(7) NOT NULL)

CREATE TABLE InfoVehicule (Id INT IDENTITY (1,1) PRIMARY KEY,
						   IdVehicules INT,
						   Km BIGINT NOT NULL,
						   UltMantenimientoGen DATE NOT NULL,
						   UltReabastecimiento DATE NOT NULL)

CREATE TABLE InfoVehiculeDetails (Id INT IDENTITY (1,1) PRIMARY KEY,
								  IdVehicules INT,
								  CambioAceite BIT NOT NULL,
								  CambioFiltroAceite BIT NOT NULL,
								  CambioFiltroAire BIT NOT NULL,
								  CambioGuayasFreno BIT NOT NULL,
								  CambioGuayasEmbrague BIT NOT NULL,
								  CambioPastFrenoDelantero BIT NOT NULL,
								  CambioPastFrenoTrasero BIT NOT NULL,
								  CambioKitArrastre BIT NOT NULL,
								  CambioLiquidoFrenos BIT NOT NULL,
								  CambioBujias BIT NOT NULL,
								  CambioManiguetaFreno BIT NOT NULL,
								  CambioManiguetaEmbrague BIT NOT NULL)
-- ******************************************************************************************************************


-- ******************************************************************************************************************
-- CREA RELACIONES
-- LLAVES FORANEAS

-- 1. TABLA: INFODRIVER DETAILS
	ALTER TABLE			InfoDriverDetails 
	ADD CONSTRAINT		FK_InfoDriverDetails_Drive 
	FOREIGN KEY			(IdDriver) 
	REFERENCES			Driver(Id)

-- 2. TABLA: ADDVEHICULE
	ALTER TABLE			AddVehicule 
	ADD CONSTRAINT		FK_AddVehicule_Driver 
	FOREIGN KEY			(IdDriver) 
	REFERENCES			Driver(Id);

	ALTER TABLE			AddVehicule 
	ADD CONSTRAINT		FK_AddVehicule_Vehicules
	FOREIGN KEY			(IdVehicules) 
	REFERENCES			Vehicules(Id);

-- 3. INFOVEHICULE
	ALTER TABLE			InfoVehicule 
	ADD CONSTRAINT		FK_InfoVehicule_AddVehicule 
	FOREIGN KEY			(IdVehicules) 
	REFERENCES			AddVehicule(Id);

-- 4. TABLA: INFOVEHICULEDETAILS
	ALTER TABLE			InfoVehiculeDetails 
	ADD CONSTRAINT		FK_InfoVehiculeDetails_AddVehicule
	FOREIGN KEY			(IdVehicules) 
	REFERENCES			AddVehicule(Id);
-- ******************************************************************************************************************


-- ******************************************************************************************************************
-- CREA STORED PROCEDURES DE LA APLICACIÓN
-- 1. CREACIÓN DE CUENTA
CREATE PROCEDURE SP_CreateAccount
		 @Nombre VARCHAR(255),
		 @Usuario VARCHAR(75),
		 @Correo VARCHAR(255),
		 @Telefono BIGINT,
		 @Contrasena VARCHAR(255),
		 @ConfirmaContrasena VARCHAR(255),
		 @TermsYCondic BIT,
		 @Licencia VARCHAR(75),
		 @FechExpLicencia DATE,
		 @Tecnomecanica VARCHAR(75),
		 @FechUltRevision DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    BEGIN TRY

        -- VARIABLE PARA CAPTURAR EL ID DEL CONDUCTOR
        DECLARE @NewDriverId INT;

        -- 1. INSERTA EN LA TABLA PRINCIPAL
        INSERT INTO		Driver (Nombre, 
								Usuario, 
								Correo, 
								Telefono, 
								Contrasena, 
								ConfirmaContraseña, 
								TermsYCondic)
        VALUES		(@Nombre, 
					 @Usuario, 
					 @Correo, 
					 @Telefono, 
					 @Contrasena, 
					 @ConfirmaContrasena, 
					 @TermsYCondic);

        -- GUARDA EL ID GENERADO
        SET @NewDriverId = SCOPE_IDENTITY();

		-- 2. Insertar en InfoDriverDetails
        INSERT INTO		InfoDriverDetails (IdDriver, 
										   Licencia, 
										   FechExpLicencia, 
										   Tecnomecanica, 
										   FechUltRevision)
        VALUES (@NewDriverId, 
				@Licencia, 
				@FechExpLicencia, 
				@Tecnomecanica, 
				@FechUltRevision);

        -- COMMIT DE VALIDACIÓN SI LA TRANSACCIÓN ES CORRECTA
        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        -- SI EXISTE UN ERROR, DESHACE LA ACCIÓN DE INSERCIÓN
        ROLLBACK TRANSACTION;
        
        -- MUESTRA EL ERROR DE CARA AL BACKEND
        THROW;
    END CATCH
END;
GO

-- 2. CREACIÓN DE VEHICULO
CREATE PROCEDURE SP_AddVehiculeUser
		@IdDriver INT,
		@IdVehicules INT,
		@TipoVehiculo VARCHAR(25),
		@Marca VARCHAR(25),
		@Referencia VARCHAR(75),
		@Modelo INT,
		@Placa VARCHAR(7),
		@Km BIGINT,
		@UltMantenimientoGen DATE,
		@UltReabastecimiento DATE,
		@CambioAceite BIT,
		@CambioFiltroAceite BIT,
		@CambioFiltroAire BIT,
		@CambioGuayasFreno BIT,
		@CambioGuayasEmbrague BIT,
		@CambioPastFrenoDelantero BIT,
		@CambioPastFrenoTrasero BIT,
		@CambioKitArrastre BIT,
		@CambioLiquidoFrenos BIT,
		@CambioBujias BIT,
		@CambioManiguetaFreno BIT,
		@CambioManiguetaEmbrague BIT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Vehicules WHERE Id = @IdVehicules)
    BEGIN
        RAISERROR('El vehículo seleccionado no es valido', 16, 1);
        RETURN;
    END;

    BEGIN TRANSACTION;
    BEGIN TRY
        DECLARE @NewAddVehiculeId INT;

        -- 1. REGISTRA EL VEHICULO DEL USUARIO
        INSERT INTO AddVehicule (IdDriver, 
								 IdVehicules, 
								 TipoVehiculo, 
								 Marca, 
								 Referencia, 
								 Modelo, 
								 Placa)
        VALUES (@IdDriver, 
				@IdVehicules, 
				@TipoVehiculo, 
				@Marca, 
				@Referencia, 
				@Modelo, 
				@Placa);

        SET @NewAddVehiculeId = SCOPE_IDENTITY();

        -- 2. INSERTA INFORMACIÓN DE USO
        INSERT INTO InfoVehicule (IdVehicules, 
								  Km, 
								  UltMantenimientoGen, 
								  UltReabastecimiento)
        VALUES (@NewAddVehiculeId, 
				@Km, 
				@UltMantenimientoGen, 
				@UltReabastecimiento);

        -- 3. INSERTA LA INFO ESPECÍFICA DEL VEHICULO
        INSERT INTO InfoVehiculeDetails (IdVehicules, 
										 CambioAceite, 
										 CambioFiltroAceite, 
										 CambioFiltroAire, 
										 CambioGuayasFreno, 
										 CambioGuayasEmbrague, 
										 CambioPastFrenoDelantero, 
										 CambioPastFrenoTrasero, 
										 CambioKitArrastre, 
										 CambioLiquidoFrenos, 
										 CambioBujias, 
										 CambioManiguetaFreno, 
										 CambioManiguetaEmbrague)
        VALUES (@NewAddVehiculeId, 
				@CambioAceite, 
				@CambioFiltroAceite, 
				@CambioFiltroAire, 
				@CambioGuayasFreno, 
				@CambioGuayasEmbrague, 
				@CambioPastFrenoDelantero, 
				@CambioPastFrenoTrasero, 
				@CambioKitArrastre, 
				@CambioLiquidoFrenos, 
				@CambioBujias, 
				@CambioManiguetaFreno, 
				@CambioManiguetaEmbrague);

        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 3. ACTUALIZA INFORMACIÓN DEL CONDUCTOR
CREATE PROCEDURE SP_UpdateDriver
    @IdDriver INT,
    @Nombre VARCHAR(255),
    @Usuario VARCHAR(75),
    @Correo VARCHAR(255),
    @Telefono BIGINT,
    @Contrasena VARCHAR(255),
    @ConfirmaContrasena VARCHAR(255),
    @TermsYCondic BIT,
    @Licencia VARCHAR(75),
    @FechExpLicencia DATE,
    @Tecnomecanica VARCHAR(75),
    @FechUltRevision DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- VALIDACIÓN: CONDUCTOR EXISTENTE
    IF NOT EXISTS (SELECT 1 FROM Driver WHERE Id = @IdDriver)
    BEGIN
        RAISERROR('El conductor especificado no existe.', 16, 1);
        RETURN;
    END;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. ACTUALIZA TABLA PRINCIPAL
        UPDATE		Driver
        SET			Nombre = @Nombre,
					Usuario = @Usuario,
					Correo = @Correo,
					Telefono = @Telefono,
					Contrasena = @Contrasena,
					ConfirmaContraseña = @ConfirmaContrasena,
					TermsYCondic = @TermsYCondic
        WHERE		Id = @IdDriver;

        -- 2. ACTUALIZA TABLA DEPENDIENTE
        UPDATE		InfoDriverDetails
        SET			Licencia = @Licencia,
					FechExpLicencia = @FechExpLicencia,
					Tecnomecanica = @Tecnomecanica,
					FechUltRevision = @FechUltRevision
        WHERE		IdDriver = @IdDriver;

        COMMIT TRANSACTION;
        
        SELECT 'Conductor actualizado con éxito' AS Resultado;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 4. ACTUALIZA INFORMACIÓN DEL VEHICULO
CREATE PROCEDURE SP_UpdateVehiculeDetails
    @IdAddVehicule INT,
    @IdVehicules INT,
    @TipoVehiculo VARCHAR(25),
    @Marca VARCHAR(25),
    @Referencia VARCHAR(75),
    @Modelo INT,

    @Km BIGINT,
    @UltMantenimientoGen DATE,
    @UltReabastecimiento DATE,

    @CambioAceite BIT,
    @CambioFiltroAceite BIT,
    @CambioFiltroAire BIT,
    @CambioGuayasFreno BIT,
    @CambioGuayasEmbrague BIT,
    @CambioPastFrenoDelantero BIT,
    @CambioPastFrenoTrasero BIT,
    @CambioKitArrastre BIT,
    @CambioLiquidoFrenos BIT,
    @CambioBujias BIT,
    @CambioManiguetaFreno BIT,
    @CambioManiguetaEmbrague BIT
AS
BEGIN
    SET NOCOUNT ON;

    -- VALIDACIÓN 1: EXISTENCIA DEL VEHICULO REGISTRADO
    IF NOT EXISTS (SELECT 1 FROM AddVehicule WHERE Id = @IdAddVehicule)
    BEGIN
        RAISERROR('El vehículo de usuario especificado no existe.', 16, 1);
        RETURN;
    END;

    -- VALIDACIÓN 2: ID DEL VEHICULO
    IF NOT EXISTS (SELECT 1 FROM Vehicules WHERE Id = @IdVehicules)
    BEGIN
        RAISERROR('El vehículo seleccionado del catálogo no existe.', 16, 1);
        RETURN;
    END;

    BEGIN TRANSACTION;
    BEGIN TRY
        
        -- 1. ACTUALIZA INFO DEL VEHICULO
        UPDATE		AddVehicule
        SET			IdVehicules = @IdVehicules,
					TipoVehiculo = @TipoVehiculo,
					Marca = @Marca,
					Referencia = @Referencia,
					Modelo = @Modelo
        WHERE		Id = @IdAddVehicule;

        -- 2. ACTUALIZA DETALLE DEL VEHICULO
        UPDATE		InfoVehicule
        SET			Km = @Km,
					UltMantenimientoGen = @UltMantenimientoGen,
					UltReabastecimiento = @UltReabastecimiento
        WHERE		IdVehicules = @IdAddVehicule; 

        -- 3. Actualizar el checklist de mantenimiento (InfoVehiculeDetails)
        UPDATE		InfoVehiculeDetails
        SET			CambioAceite = @CambioAceite,
					CambioFiltroAceite = @CambioFiltroAceite,
					CambioFiltroAire = @CambioFiltroAire,
					CambioGuayasFreno = @CambioGuayasFreno,
					CambioGuayasEmbrague = @CambioGuayasEmbrague,
					CambioPastFrenoDelantero = @CambioPastFrenoDelantero,
					CambioPastFrenoTrasero = @CambioPastFrenoTrasero,
					CambioKitArrastre = @CambioKitArrastre,
					CambioLiquidoFrenos = @CambioLiquidoFrenos,
					CambioBujias = @CambioBujias,
					CambioManiguetaFreno = @CambioManiguetaFreno,
					CambioManiguetaEmbrague = @CambioManiguetaEmbrague
        WHERE		IdVehicules = @IdAddVehicule;

        COMMIT TRANSACTION;
        
        SELECT 'Información del vehículo actualizada con éxito' AS Resultado;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
-- ******************************************************************************************************************


-- ******************************************************************************************************************
-- ÁREA DE PRUEBAS (VALIDACIÓN DE QUE LA INFO REGISTRADA EN LA APP ESTÁ CAYENDO CORRECTAMENTE)

SELECT		*
FROM		Driver

SELECT		*
FROM		InfoDriverDetails

SELECT		*
FROM		AddVehicule

SELECT		*
FROM		InfoVehicule

SELECT		*
FROM		InfoVehiculeDetails
