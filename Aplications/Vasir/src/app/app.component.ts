import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline, arrowBackOutline, calendarOutline, carSportOutline,
  checkmarkCircleOutline, chevronForwardOutline, constructOutline,
  documentTextOutline, folderOpenOutline, homeOutline, logOutOutline,
  notificationsOutline, personCircleOutline, speedometerOutline,
  timeOutline, waterOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      alertCircleOutline, arrowBackOutline, calendarOutline, carSportOutline,
      checkmarkCircleOutline, chevronForwardOutline, constructOutline,
      documentTextOutline, folderOpenOutline, homeOutline, logOutOutline,
      notificationsOutline, personCircleOutline, speedometerOutline,
      timeOutline, waterOutline
    });
  }
}
