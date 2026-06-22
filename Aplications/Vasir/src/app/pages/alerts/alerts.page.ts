import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({ selector: 'app-alerts', standalone: true, imports: [RouterLink, IonicModule, BottomNavComponent], templateUrl: './alerts.page.html', styleUrls: ['./alerts.page.scss'] })
export class AlertsPage {}
