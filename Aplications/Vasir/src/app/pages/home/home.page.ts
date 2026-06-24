import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
import { AppDataService } from '../../services/app-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink, BottomNavComponent]
})
export class HomePage {
  constructor(public data: AppDataService) { }

  get progress(): number {
    return Math.min(100, Math.round((this.data.vehicle.km / this.data.vehicle.nextMaintenanceKm) * 100));
  }

}
