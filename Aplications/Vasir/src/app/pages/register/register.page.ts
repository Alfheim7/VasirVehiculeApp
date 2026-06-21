import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegisterPage {

  formData = {
    Nombre: '',
    Usuario: '',
    Correo: '',
    Telefono: null,
    Contrasena: '',
    ConfirmaContrasena: '',
    TermsYCondic: false,
    Licencia: '',
    FechExpLicencia: '',
    Tecnomecanica: '',
    FechUltRevision: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  async onRegister() {
    if (this.formData.Contrasena !== this.formData.ConfirmaContrasena) {
      this.presentAlert('Error de Validación', 'Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (!this.formData.TermsYCondic) {
      this.presentAlert('Términos Obligatorios', 'Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    try {
      await this.authService.registerDriver(this.formData);
      const successAlert = await this.alertCtrl.create({
        header: 'Registro Exitoso',
        message: 'El conductor y sus detalles relacionales han sido guardados localmente.',
        buttons: [{
          text: 'Ir al Login',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }]
      });
      await successAlert.present();
    } catch (error) {
      this.presentAlert('Error al Guardar', error as string);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Entendido']
    });
    await alert.present();
  }
}