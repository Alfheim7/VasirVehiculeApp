import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppDataService, HistoryEntry } from '../../services/app-data';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({ selector: 'app-history', standalone: true, imports: [CommonModule, RouterLink, IonicModule, BottomNavComponent], templateUrl: './history.page.html', styleUrls: ['./history.page.scss'] })
export class HistoryPage {
  filter: 'all' | HistoryEntry['type'] = 'all';
  constructor(public data: AppDataService) {}
  get entries() { return this.filter === 'all' ? this.data.history : this.data.history.filter(item => item.type === this.filter); }
}
