import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AppDataService, VehicleDocuments } from '../../services/app-data';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({ selector: 'app-documents', standalone: true, imports: [FormsModule, IonicModule, BottomNavComponent], templateUrl: './documents.page.html', styleUrls: ['./documents.page.scss'] })
export class DocumentsPage {
  form: VehicleDocuments;
  constructor(private data: AppDataService, private toast: ToastController) { this.form = { ...data.documents }; }
  async save() { this.data.updateDocuments(this.form); (await this.toast.create({ message: 'Documentos guardados', color: 'success', duration: 1800 })).present(); }
}
