import { inject, Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, firstValueFrom, throwError } from 'rxjs'; 
import { CommonModule } from '@angular/common';
import {  UserLogin } from '../interfaces/User';
import { LocalStorageService } from './local-storage.service';  

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5290/api/Auth';
  private http = inject(HttpClient);
  private localStorage = inject(LocalStorageService)
  public errors: string[] = [];
  localStorageService: any;
  private authStatusSubject  = new BehaviorSubject<boolean>(false);
 
  constructor() {
    this.initializeAuth(); 
  }

  async initializeAuth(){

    const token = this.localStorage.getVariable('token');  
    const rolId = this.localStorage.getVariable('rolId');
    
  } 
//POST:login
  login(form: any): Observable<UserLogin> {
    return this.http.post<UserLogin>(this.baseUrl + '/login', form).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Error desconocido';

            if (error.error && typeof error.error === 'object' && error.error.message) {
                
                errorMessage = error.error.message;
            } else if (error.error && typeof error.error === 'string') {
                
                errorMessage = error.error;
            } else if (error.message) {
                
                errorMessage = error.message;
            }

            this.errors.push(errorMessage);
            return throwError(() => new Error(errorMessage));
        })
    );
  } 
  isAuthenticated(): boolean {
    return this.authStatusSubject.value;   
  }
 
  getAuthStatus(): Observable<boolean> {
    return this.authStatusSubject.asObservable();
  }
 
  setAuthStatus(status: boolean): void {
    this.localStorageService.setVariable('isAuthenticated', status.toString());
    this.authStatusSubject.next(status);
  }
}