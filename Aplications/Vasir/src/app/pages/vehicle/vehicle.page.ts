import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppDataService } from '../../services/app-data';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({ selector: 'app-vehicle', standalone: true, imports: [CommonModule, RouterLink, IonicModule, BottomNavComponent], templateUrl: './vehicle.page.html', styleUrls: ['./vehicle.page.scss'] })
export class VehiclePage { constructor(public data: AppDataService) {} }
