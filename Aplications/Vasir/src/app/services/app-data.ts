import { Injectable } from '@angular/core';

export interface VehicleProfile {
  type: string;
  brand: string;
  reference: string;
  model: number;
  plate: string;
  km: number;
  nextMaintenanceKm: number;
  lastMaintenance: string;
  lastFuelDate: string;
  fuelKm: number;
}

export interface VehicleDocuments {
  license: string;
  licenseStatus: string;
  soat: string;
  soatExpiration: string;
  technicalReview: string;
  technicalExpiration: string;
}

export interface HistoryEntry {
  id: number;
  type: 'maintenance' | 'fuel' | 'document';
  title: string;
  date: string;
  detail: string;
  status: string;
}

interface VasirLocalState {
  vehicle: VehicleProfile;
  documents: VehicleDocuments;
  history: HistoryEntry[];
}

@Injectable({ providedIn: 'root' })
export class AppDataService {
  private readonly storageKey = 'vasir_demo_data';

  private readonly defaults: VasirLocalState = {
    vehicle: {
      type: 'Motocicleta', brand: 'Yamaha', reference: 'FZ 2.0', model: 2022,
      plate: 'ABC12D', km: 18500, nextMaintenanceKm: 20000,
      lastMaintenance: '2026-03-10', lastFuelDate: '2026-03-15', fuelKm: 320
    },
    documents: {
      license: 'Registrada', licenseStatus: 'Vence en 90 días', soat: 'Póliza vigente',
      soatExpiration: '2026-07-22', technicalReview: 'Pendiente', technicalExpiration: '2026-08-12'
    },
    history: [
      { id: 1, type: 'maintenance', title: 'Cambio de aceite', date: '10/03/2026', detail: '18.000 km', status: 'Realizado' },
      { id: 2, type: 'maintenance', title: 'Cambio filtro de aire', date: '10/03/2026', detail: '18.000 km', status: 'Realizado' },
      { id: 3, type: 'fuel', title: 'Reabastecimiento', date: '15/03/2026', detail: '$45.000', status: 'Registrado' },
      { id: 4, type: 'document', title: 'Revisión general', date: '01/02/2026', detail: '', status: 'Registrado' }
    ]
  };

  get vehicle(): VehicleProfile { return this.read().vehicle; }
  get documents(): VehicleDocuments { return this.read().documents; }
  get history(): HistoryEntry[] { return this.read().history; }

  get driverName(): string {
    try {
      const driver = JSON.parse(localStorage.getItem('vasir_current_driver') || '{}');
      return driver.Nombre || driver.nombre || 'Usuario';
    } catch {
      return 'Usuario';
    }
  }

  updateVehicle(changes: Partial<VehicleProfile>): void {
    const state = this.read();
    state.vehicle = { ...state.vehicle, ...changes };
    this.write(state);
  }

  updateDocuments(changes: Partial<VehicleDocuments>): void {
    const state = this.read();
    state.documents = { ...state.documents, ...changes };
    this.write(state);
  }

  addMaintenance(items: string[], date: string, km: number): void {
    const state = this.read();
    const nextId = Math.max(0, ...state.history.map(item => item.id)) + 1;
    const formattedDate = date ? date.split('-').reverse().join('/') : new Date().toLocaleDateString('es-CO');
    items.forEach((item, index) => state.history.unshift({
      id: nextId + index, type: 'maintenance', title: item,
      date: formattedDate, detail: `${km.toLocaleString('es-CO')} km`, status: 'Realizado'
    }));
    state.vehicle.km = km || state.vehicle.km;
    state.vehicle.lastMaintenance = date || state.vehicle.lastMaintenance;
    this.write(state);
  }

  resetDemo(): void {
    localStorage.removeItem(this.storageKey);
  }

  private read(): VasirLocalState {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : structuredClone(this.defaults);
    } catch {
      return structuredClone(this.defaults);
    }
  }

  private write(state: VasirLocalState): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }
}
