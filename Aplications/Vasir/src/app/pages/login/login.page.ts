import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth'; 
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent, IonItem, IonInput, IonButton, IonIcon
  ]
})
export class LoginPage implements OnInit {

  // Declaración explícita e individual
  usuario: string = '';
  contrasena: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  async onLogin() {
    if (!this.usuario.trim() || !this.contrasena.trim()) {
      this.showToast('Por favor, ingrese usuario y contraseña.', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Conectando con Vasir...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Invocamos el método original pasándole las dos variables individuales del HTML
      const response = await this.authService.loginDriver(this.usuario.trim(), this.contrasena.trim());
      
      await loading.dismiss();

      if (response && response.success) {
        this.showToast(response.message || '¡Bienvenido!', 'success');

        // Mapeo seguro para que el componente de añadir vehículos encuentre el Id del Conductor
        const sessionUser = {
          idDriver: response.Id,
          nombre: response.Nombre,
          email: response.Email
        };

        // Guardamos las banderas y los datos de sesión en el LocalStorage
        localStorage.setItem('user', JSON.stringify(sessionUser));
        localStorage.setItem('hasVehicles', JSON.stringify(response.hasVehicles));

        // Redirección condicional
        if (response.hasVehicles) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/add-vehicle']);
        }
      } else {
        this.showToast(response?.message || 'Error de acceso.', 'danger');
      }

    } catch (err: any) {
      await loading.dismiss();
      console.error('❌ Error capturado en la UI:', err);
      const errorMsg = err.error?.message || 'Usuario o contraseña incorrectos.';
      this.showToast(errorMsg, 'danger');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  enterDemo() {
    this.authService.startDemoSession();
    this.router.navigate(['/home']);
  }

  async showToast(msg: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }
}
