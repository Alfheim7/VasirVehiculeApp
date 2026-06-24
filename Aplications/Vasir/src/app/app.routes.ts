import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'add-vehicle',
    loadComponent: () => import('./pages/add-vehicle/add-vehicle.page').then(m => m.AddVehiclePage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'vehicle',
    loadComponent: () => import('./pages/vehicle/vehicle.page').then(m => m.VehiclePage)
  },
  {
    path: 'vehicle-empty',
    loadComponent: () => import('./pages/vehicle-empty/vehicle-empty.page').then(m => m.VehicleEmptyPage)
  },
  {
    path: 'update-vehicle',
    loadComponent: () => import('./pages/update-vehicle/update-vehicle.page').then(m => m.UpdateVehiclePage)
  },
  {
    path: 'documents',
    loadComponent: () => import('./pages/documents/documents.page').then(m => m.DocumentsPage)
  },
  {
    path: 'maintenance',
    loadComponent: () => import('./pages/maintenance/maintenance.page').then(m => m.MaintenancePage)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.page').then(m => m.HistoryPage)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./pages/alerts/alerts.page').then(m => m.AlertsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];
