🚀 Proyecto Vasir - Sistema de Gestión de Vehículos

Glosario:

backend = (VasirAPI)
fronend = (Vasir)

Este repositorio contiene la arquitectura completa de Vasir, una solución de gestión vehicular compuesta por una API construida en Node.js con conexión a SQL Server y una aplicación móvil híbrida desarrollada en Ionic + Angular.

🛠️ Requisitos Previos del Sistema

Antes de iniciar con la instalación de dependencias, el equipo de desarrollo debe tener instaladas las siguientes herramientas globales:

1. Node.js (Versión LTS recomendada v18 o superior) y npm (incluido con Node).
2. SQL Server & SSMS (SQL Server Management Studio): Instancia local configurada (usualmente SQLEXPRESS).
3. Ionic CLI: Interfaz de línea de comandos global de Ionic. Instálala ejecutando en tu terminal: 

Bash > npm install -g @ionic/cli

💾 1. Configuración de la Base de Datos (SQL Server)

Abre SQL Server Management Studio (SSMS). Ejecuta el script de bases de datos de la aplicación (Vasir.sql) para crear la base de datos Asgard, las tablas estructuradas y los Procedimientos Almacenados transaccionales. Asegúrate de que el usuario asignado tenga los permisos correspondientes de lectura y ejecución (Cree un usuario con las caracteristicas del archivo .env de la carpeta VasirAPI. Allí encontrará que nombre y contraseña debe tener. Además de contener el nombre del servidor, algo similar a lo que dice en la línea DB_SERVER (Punto 2.)).

Ejecute el archivo Vasir.sql de forma escalonada. Primero cree las tablas y llaves foráneas y por último cree los SP, ya que al ejecutar todo a la vez, genera conflicto. Tenga este punto en cuenta, de otra forma siempre le generará error.

Ejecute el archivo Catalogo Vasir.sql inmediatamente después de crear la base de datos. Este, lo puede ejecutar completo sin ningun problema.

🌐 2. Configuración y Ejecución del Backend (API Rest)

El backend actúa como el puente lógico persistiendo los datos en SQL Server a través de endpoints seguros mapeados con procedimientos almacenados. Variables de Entorno (.env) en la raíz de la carpeta del backend, al existir el archivo, no es necesario crearlo, solo modificar el apartado de DB_SERVER. Recuerde que es vital que el usuario y contraseña de la BD sean iguales.

PORT=3000 (Debe ser este puerto, Windows configura por defecto este o el 4000)
DB_USER=VasirAdmin (Este es el nombre del usuario que debe crear en SSMS)
DB_PASSWORD=AdminApp (Esta es la contraseña de logueo que debe tener el usuario de SSMS)
DB_SERVER=LAPTOP-K2PODENF\SQLEXPRESS (Esto varía según el equipo, modificar según el usuario generado por SSMS al momento de la instalación)
DB_DATABASE=Asgard (Inamovible, ya que el archivo Vasir.sql crea esta BD por defecto)

📥 Instalación de Dependencias del Backend

Navega a la carpeta del backend desde tu terminal e instala los paquetes necesarios (express, cors, mssql, dotenv): 

Bash cd backend > npm install 

🚀 Ejecución de la API

Para iniciar el servidor de desarrollo, cuentas con dos opciones configuradas en el package.json:

Modo Producción / Estándar:

Bash: npm start

Modo Desarrollo (Recomendado - Monitorea cambios en tiempo real con Nodemon):

Bash: npm run dev

El servidor se levantará en el puerto indicado (http://localhost:3000) mostrando en consola la confirmación de la ruta activa.

📱 3. Configuración y Ejecución del Frontend (Ionic / Angular)

La aplicación móvil está estructurada bajo el framework Ionic, optimizada para interactuar dinámicamente con los endpoints del backend.

📥 Instalación de Dependencias del Frontend

Navega a la carpeta raíz del proyecto frontend e instala las dependencias de node locales de Angular e Ionic: 

Bash: cd > frontend npm install

⚙️ Verificación del Service / API URL

Verifica que el archivo de configuración del entorno o tu servicio de autenticación (auth.ts) apunte a la dirección local correcta de la API levantada en el paso anterior: TypeScriptAPI_URL = 'http://localhost:3000/api';

🚀 Ejecución en Entorno Local (Navegador)

Para compilar y levantar la aplicación web híbrida localmente de manera transparente, ejecuta: 

Bash: ionic serve.

Este comando compilará el proyecto en memoria, abrirá automáticamente tu navegador web predeterminado en la dirección http://localhost:8100 y refrescará automáticamente la pantalla cada vez que realices y guardes un cambio en tus componentes Angular.