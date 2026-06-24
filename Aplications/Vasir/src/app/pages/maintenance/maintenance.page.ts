import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AppDataService } from '../../services/app-data';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({ selector: 'app-maintenance', standalone: true, imports: [CommonModule, FormsModule, IonicModule, BottomNavComponent], templateUrl: './maintenance.page.html', styleUrls: ['./maintenance.page.scss'] })
export class MaintenancePage {
  date = new Date().toISOString().slice(0, 10);
  km: number;
  items = ['Cambio de aceite', 'Cambio filtro de aceite', 'Cambio filtro de aire', 'Cambio guayas de freno', 'Cambio guayas de embrague', 'Cambio pastillas de freno delantero', 'Cambio pastillas de freno trasero', 'Cambio kit de arrastre', 'Cambio líquido de frenos', 'Cambio de bujías', 'Cambio manigueta de freno', 'Cambio manigueta de embrague'].map(label => ({ label, checked: false }));
  constructor(private data: AppDataService, private toast: ToastController, private router: Router) { this.km = data.vehicle.km; }
  async save() { const selected = this.items.filter(item => item.checked).map(item => item.label); if (!selected.length) { (await this.toast.create({ message: 'Selecciona al menos un servicio', color: 'warning', duration: 1800 })).present(); return; } this.data.addMaintenance(selected, this.date, this.km); (await this.toast.create({ message: 'Mantenimiento registrado', color: 'success', duration: 1800 })).present(); this.router.navigate(['/history']); }
}
