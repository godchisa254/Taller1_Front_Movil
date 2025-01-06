import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  setVariable(key: string, value: any): void { 
    localStorage.setItem(key, JSON.stringify(value));
  }

  getVariable(key: string): any {
    return  localStorage.getItem(key);
  }

  removeVariable(key: string){
    localStorage.removeItem(key);
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {

      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

  
      return payload.role || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}
