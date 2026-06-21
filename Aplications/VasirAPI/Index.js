require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();

app.use(cors());
app.use(express.json());

// ====================================================================================================
// CONFIGURACIÓN CON TUS VARIABLES DE ENTORNO REALES (.ENV)
// ====================================================================================================
const dbConfig = {
    user: process.env.DB_USER,        
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,    
    database: process.env.DB_DATABASE, 
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', 
        trustServerCertificate: true 
    }
};

// ====================================================================================================
// 🚗 ENDPOINT 1: CATÁLOGO MAESTRO DE VEHÍCULOS
// ====================================================================================================
app.get('/api/vehicles/catalog', async (req, res) => {
    console.log("📥 Solicitando el catálogo maestro de vehículos...");
    try {
        const pool = await sql.connect(dbConfig);
        await pool.query(`USE ${process.env.DB_DATABASE}`);
        const request = pool.request();
        
        const result = await request.query('SELECT Id, Consecionario, Referencia, Modelo FROM Vehicules');

        const mappedCatalog = result.recordset.map(vehicle => ({
            Id: vehicle.Id,
            id: vehicle.Id,
            Consecionario: vehicle.Consecionario,
            consecionario: vehicle.Consecionario,
            Marca: vehicle.Consecionario,
            marca: vehicle.Consecionario,
            Referencia: vehicle.Referencia,
            referencia: vehicle.Referencia,
            Modelo: vehicle.Modelo,
            modelo: vehicle.Modelo
        }));

        res.json(mappedCatalog); 
    } catch (err) {
        console.error("❌ ERROR AL LEER EL CATÁLOGO DE VEHÍCULOS:", err.message);
        res.status(500).json({ success: false, message: 'No se pudo leer el catálogo.', error: err.message });
    }
});

// ====================================================================================================
// 💾 ENDPOINT 2: GUARDAR VEHÍCULO
// ====================================================================================================
app.post('/api/vehicles/add', async (req, res) => {
    console.log("📥 Recibiendo petición para guardar vehículo con SP_AddVehiculeUser...");
    
    // Mapeo de los 22 campos que requiere el procedimiento almacenado
    const {
        IdDriver, IdVehicules, TipoVehiculo, Marca, Referencia, Modelo, Placa,
        Km, UltMantenimientoGen, UltReabastecimiento,
        CambioAceite, CambioFiltroAceite, CambioFiltroAire, CambioGuayasFreno,
        CambioGuayasEmbrague, CambioPastFrenoDelantero, CambioPastFrenoTrasero,
        CambioKitArrastre, CambioLiquidoFrenos, CambioBujias, CambioManiguetaFreno,
        CambioManiguetaEmbrague
    } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        await pool.query(`USE ${process.env.DB_DATABASE}`);
        const request = pool.request();

        // 1. Datos principales del vehículo del usuario
        request.input('IdDriver', sql.Int, IdDriver);
        request.input('IdVehicules', sql.Int, IdVehicules);
        request.input('TipoVehiculo', sql.VarChar(25), TipoVehiculo);
        request.input('Marca', sql.VarChar(25), Marca);
        request.input('Referencia', sql.VarChar(75), Referencia);
        request.input('Modelo', sql.Int, Modelo);
        request.input('Placa', sql.VarChar(7), Placa);

        // 2. Información de uso
        request.input('Km', sql.BigInt, Km);
        request.input('UltMantenimientoGen', sql.Date, UltMantenimientoGen);
        request.input('UltReabastecimiento', sql.Date, UltReabastecimiento);

        // 3. Checklist de Mantenimiento Detallado
        request.input('CambioAceite', sql.Bit, CambioAceite);
        request.input('CambioFiltroAceite', sql.Bit, CambioFiltroAceite);
        request.input('CambioFiltroAire', sql.Bit, CambioFiltroAire);
        request.input('CambioGuayasFreno', sql.Bit, CambioGuayasFreno);
        request.input('CambioGuayasEmbrague', sql.Bit, CambioGuayasEmbrague);
        request.input('CambioPastFrenoDelantero', sql.Bit, CambioPastFrenoDelantero);
        request.input('CambioPastFrenoTrasero', sql.Bit, CambioPastFrenoTrasero);
        request.input('CambioKitArrastre', sql.Bit, CambioKitArrastre);
        request.input('CambioLiquidoFrenos', sql.Bit, CambioLiquidoFrenos);
        request.input('CambioBujias', sql.Bit, CambioBujias);
        request.input('CambioManiguetaFreno', sql.Bit, CambioManiguetaFreno);
        request.input('CambioManiguetaEmbrague', sql.Bit, CambioManiguetaEmbrague);

        // Ejecución segura
        await request.execute('SP_AddVehiculeUser');

        console.log(`✅ Vehículo con placa ${Placa} guardado con éxito mediante SP para el conductor ID: ${IdDriver}`);
        res.json({ success: true, message: 'Vehículo registrado con éxito en SQL Server.' });

    } catch (err) {
        console.error("❌ ERROR EN SP_ADDVEHICULEUSER:", err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error de procesamiento en el servidor.', 
            error: err.message 
        });
    }
});

// ====================================================================================================
// 🔐 ENDPOINT 3: LOGIN
// ====================================================================================================
app.post('/api/auth/login', async (req, res) => {
    const identifier = req.body.Usuario;
    const password = req.body.Contrasena;

    if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Por favor, complete todos los campos.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.query(`USE ${process.env.DB_DATABASE}`);
        const request = pool.request();

        request.input('Identifier', sql.VarChar(100), identifier);
        const userResult = await request.query('SELECT * FROM Driver WHERE Usuario = @Identifier OR Nombre = @Identifier');

        if (userResult.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }

        const user = userResult.recordset[0];

        if (user.Contrasena !== password) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }

        const vehicleRequest = pool.request();
        vehicleRequest.input('IdDriver', sql.Int, user.Id);
        const vehicleResult = await vehicleRequest.query('SELECT COUNT(*) AS TotalVehicles FROM AddVehicule WHERE IdDriver = @IdDriver');

        const totalVehicles = vehicleResult.recordset[0].TotalVehicles;
        const hasVehicles = totalVehicles > 0;

        res.json({
            success: true,
            message: '¡Bienvenido a Vasir!',
            Id: user.Id,
            Nombre: user.Nombre,
            Usuario: user.Usuario,
            hasVehicles: hasVehicles 
        });
    } catch (err) {
        console.error("❌ ERROR EN EL ENDPOINT DE LOGIN:", err.message);
        res.status(500).json({ success: false, error: 'Error de conexión.' });
    }
});

// ====================================================================================================
// 📝 ENDPOINT 4: CREACIÓN DE CUENTA
// ====================================================================================================
app.post('/api/auth/register', async (req, res) => {
    const { 
        Nombre, Usuario, Correo, Telefono, Contrasena, ConfirmaContrasena, TermsYCondic,
        Licencia, FechExpLicencia, Tecnomecanica, FechUltRevision 
    } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        await pool.query(`USE ${process.env.DB_DATABASE}`);
        const request = pool.request();

        request.input('Nombre', sql.VarChar(255), Nombre);
        request.input('Usuario', sql.VarChar(75), Usuario);
        request.input('Correo', sql.VarChar(255), Correo);
        request.input('Telefono', sql.BigInt, Telefono); 
        request.input('Contrasena', sql.VarChar(255), Contrasena);
        request.input('ConfirmaContrasena', sql.VarChar(255), ConfirmaContrasena);
        request.input('TermsYCondic', sql.Bit, TermsYCondic); 
        request.input('Licencia', sql.VarChar(75), Licencia);
        request.input('FechExpLicencia', sql.Date, FechExpLicencia); 
        request.input('Tecnomecanica', sql.VarChar(75), Tecnomecanica);
        request.input('FechUltRevision', sql.Date, FechUltRevision); 

        await request.execute('SP_CreateAccount');
        res.json({ success: true, message: 'Conductor registrado de manera exitosa.' });
    } catch (err) {
        console.error("❌ ERROR EN SP_CREATEACCOUNT:", err.message);
        res.status(500).json({ success: false, message: 'Error al Guardar el conductor.', error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT} conectado a ${process.env.DB_DATABASE}`);
});