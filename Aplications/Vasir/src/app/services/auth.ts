import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000/api';
  private CURRENT_DRIVER_KEY = 'vasir_current_driver';

  constructor(private http: HttpClient) { }

  setCurrentDriver(driver: any) {
    localStorage.setItem(this.CURRENT_DRIVER_KEY, JSON.stringify(driver));
  }

  getCurrentDriver(): any {
    const driver = localStorage.getItem(this.CURRENT_DRIVER_KEY);
    return driver ? JSON.parse(driver) : null;
  }

  async loginDriver(usuario: string, contrasena: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.post(`${this.API_URL}/auth/login`, { Usuario: usuario, Contrasena: contrasena })
    );
    this.setCurrentDriver(res);
    return res;
  }

  async registerDriver(driverData: any): Promise<any> {
    return await firstValueFrom(
      this.http.post(`${this.API_URL}/auth/register`, driverData)
    );
  }

  async getVehiclesCatalog(): Promise<any[]> {
    return await firstValueFrom(
      this.http.get<any[]>(`${this.API_URL}/vehicles/catalog`)
    );
  }

  async addVehiculeUser(vehicleData: any): Promise<any> {
    const currentDriver = this.getCurrentDriver();
    const payload = {
      IdDriver: currentDriver.Id,
      ...vehicleData
    };
    return await firstValueFrom(
      this.http.post(`${this.API_URL}/vehicles/add`, payload)
    );
  }
}