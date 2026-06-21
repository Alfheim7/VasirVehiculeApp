import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AddVehiclePage implements OnInit {

  // Atributos para almacenar e imprimir los datos de sesión en la interfaz
  driverName: string = '';
  driverId: number | null = null;

  // Colecciones de datos para el manejo reactivo de los Selects dependientes
  fullCatalog: any[] = [];
  availableBrands: string[] = [];
  filteredReferences: string[] = [];
  filteredModels: string[] = [];

  // Modelos de enlace bidireccional
  selectedBrand: string = '';
  selectedReference: string = '';
  selectedModel: string = '';

  // Objeto estructurado plano que viaja hacia el Backend
  vehicleData = {
    IdDriver: null as number | null,     // Llave foránea 1: Conductor activo
    IdVehicules: null as number | null,  // Llave foránea 2: ID de fila en tabla Vehicules
    TipoVehiculo: '',
    Marca: '',
    Referencia: '',
    Modelo: null as number | null,       // Mapeado como INT (Año del vehículo)
    Placa: '',                           // VARCHAR(7) obligatorio NOT NULL
    Km: null,
    UltMantenimientoGen: '',
    UltReabastecimiento: '',
    CambioAceite: false,
    CambioFiltroAceite: false,
    CambioFiltroAire: false,
    CambioGuayasFreno: false,
    CambioGuayasEmbrague: false,
    CambioPastFrenoDelantero: false,
    CambioPastFrenoTrasero: false,
    CambioKitArrastre: false,
    CambioLiquidoFrenos: false,
    CambioBujias: false,
    CambioManiguetaFreno: false,
    CambioManiguetaEmbrague: false
  };

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    // 1. Validamos y extraemos la persistencia de datos del usuario autenticado
    const currentDriver = this.authService.getCurrentDriver();
    if (currentDriver) {
      this.driverName = currentDriver.Nombre;
      this.driverId = currentDriver.Id;
      this.vehicleData.IdDriver = currentDriver.Id; 
    } else {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // 2. Consumimos el catálogo de referencias
      this.fullCatalog = await this.authService.getVehiclesCatalog();
      // Extraemos marcas únicas basadas en la respuesta
      this.availableBrands = [...new Set(this.fullCatalog.map(item => item.Marca))];
    } catch (err) {
      this.presentAlert('Error de Catálogo', 'No se pudo leer el catálogo maestro de vehículos.');
    }
  }

  // Escucha el cambio de selección en la Marca
  onBrandChange() {
    this.vehicleData.Marca = this.selectedBrand;
    
    this.filteredReferences = [...new Set(
      this.fullCatalog
        .filter(item => item.Marca === this.selectedBrand)
        .map(item => item.Referencia)
    )];
    
    // Limpieza en cascada absoluta para prevenir desincronizaciones
    this.selectedReference = '';
    this.selectedModel = '';
    this.filteredModels = [];
    this.vehicleData.IdVehicules = null;
    this.vehicleData.Modelo = null;
  }

  // Escucha el cambio de selección en la Referencia
  onReferenceChange() {
    this.vehicleData.Referencia = this.selectedReference;
    
    this.filteredModels = [...new Set(
      this.fullCatalog
        .filter(item => item.Marca === this.selectedBrand && item.Referencia === this.selectedReference)
        .map(item => item.Modelo)
    )];
    
    this.selectedModel = '';
    this.vehicleData.IdVehicules = null;
    this.vehicleData.Modelo = null;
  }

  // Escucha el cambio de selección en el Modelo
  onModelChange() {
    if (!this.selectedModel) return;

    // Convertimos a entero el año seleccionado para evitar conflictos de tipo
    const anioNumerico = parseInt(this.selectedModel, 10);
    this.vehicleData.Modelo = anioNumerico;

    // Buscamos el registro comparando rigurosamente los tipos correctos
    const match = this.fullCatalog.find(item => 
      item.Marca === this.selectedBrand && 
      item.Referencia === this.selectedReference && 
      parseInt(item.Modelo, 10) === anioNumerico
    );
    
    if (match) {
      this.vehicleData.IdVehicules = match.Id;
      console.log("🎯 [AddVehiclePage] ID de Catálogo Vinculado Exitosamente! IdVehicules =", match.Id);
    } else {
      this.vehicleData.IdVehicules = null;
      console.error("⚠️ No se encontró coincidencia exacta en el catálogo para los datos seleccionados.");
    }
  }

  // Envío final del formulario estructurado hacia el Backend
  async onAddVehicle() {
    // Re-vinculación de seguridad del ID del conductor logueado
    if (this.driverId) {
      this.vehicleData.IdDriver = this.driverId;
    } else {
      this.presentAlert('Sesión Inválida', 'No se reconoce el identificador del conductor.');
      this.router.navigate(['/login']);
      return;
    }

    // Validación 1: Catálogo vinculado correctamente
    if (!this.vehicleData.IdVehicules) {
      this.presentAlert('Validación', 'Por favor complete los datos relacionales (Marca, Referencia y Modelo).');
      return;
    }

    // Validación 2: Restricción de Placa obligatoria
    if (!this.vehicleData.Placa || this.vehicleData.Placa.trim() === '') {
      this.presentAlert('Validación', 'El número de Placa es mandatorio para registrar el vehículo.');
      return;
    }

    if (this.vehicleData.Placa.length > 7) {
      this.presentAlert('Formato Incorrecto', 'La placa no puede contener más de 7 caracteres.');
      return;
    }

    console.log("📦 [AddVehiclePage] Payload final listo para enviarse a Node.js:", this.vehicleData);

    try {
      const response = await this.authService.addVehiculeUser(this.vehicleData);
      console.log("📥 [AddVehiclePage] Respuesta exitosa del servidor:", response);

      const successAlert = await this.alertCtrl.create({
        header: 'Registro Exitoso',
        message: 'Tu vehículo y el checklist de mantenimiento inicial se insertaron en cascada con éxito.',
        buttons: [{ 
          text: 'Ir al Home', 
          handler: () => this.router.navigate(['/home']) 
        }]
      });
      await successAlert.present();

    } catch (error: any) {
      console.error("❌ [AddVehiclePage] Error capturado en el flujo HTTP:", error);
      const databaseErrorMessage = error.error?.error || 'Error de procesamiento. Abre la terminal de la API para ver el log.';
      this.presentAlert('Fallo en Inserción Relacional', databaseErrorMessage);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}