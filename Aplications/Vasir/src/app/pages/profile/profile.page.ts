import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { AppDataService } from '../../services/app-data';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({ selector: 'app-profile', standalone: true, imports: [RouterLink, IonicModule, BottomNavComponent], templateUrl: './profile.page.html', styleUrls: ['./profile.page.scss'] })
export class ProfilePage {
  constructor(public data: AppDataService, private auth: AuthService, private alerts: AlertController, private router: Router) {}
  async logout() { const alert = await this.alerts.create({ header: 'Cerrar sesión', message: '¿Deseas cerrar tu sesión?', buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Cerrar sesión', role: 'destructive', handler: () => { this.auth.logout(); this.router.navigate(['/welcome']); } }] }); await alert.present(); }
}
