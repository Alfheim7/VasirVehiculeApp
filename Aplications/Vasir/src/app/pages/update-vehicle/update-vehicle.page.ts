import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AppDataService, VehicleProfile } from '../../services/app-data';

@Component({ selector: 'app-update-vehicle', standalone: true, imports: [FormsModule, IonicModule], templateUrl: './update-vehicle.page.html', styleUrls: ['./update-vehicle.page.scss'] })
export class UpdateVehiclePage {
  form: VehicleProfile;
  constructor(private data: AppDataService, private router: Router, private toast: ToastController) { this.form = { ...data.vehicle }; }
  async save() { this.data.updateVehicle(this.form); (await this.toast.create({ message: 'Información actualizada', color: 'success', duration: 1800 })).present(); this.router.navigate(['/vehicle']); }
}
