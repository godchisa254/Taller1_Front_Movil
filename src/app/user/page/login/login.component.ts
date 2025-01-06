import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserLogin } from '../../interfaces/User';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { LocalStorageService } from '../../service/local-storage.service';
import { TabbarComponent } from '../../../shared/component/tabbar/tabbar.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  error: boolean = false;
  errorMessage: string = '';

  protected readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        this.alphanumericValidator(),
      ],
    ],
  });
  protected loading = false;

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    }

    const loginData = this.loginForm.value;
    this.loading = true;

    this.authService
      .login(loginData)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.loading = true;
          if (response.token) {
            const role = this.localStorageService.getRoleFromToken();
            setTimeout(() => {
              if (role === 'Admin') {
                this.router.navigate(['/404']);
              } else {
                this.router.navigate(['/tabs/home']);
                console.log('Login successful');
                this.authService.setAuthStatus(true);
                this.localStorageService.setVariable('isAuthenticated', 'true');
                this.loading = false;
              }
            }, 1500);
          } else {
            console.log('Error in login');
            this.error = true;
          }
        },
        error: (error) => {
          this.error = true;
          this.errorMessage = error;
          console.log(this.errorMessage);
        },
      });
  }

  private alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const regex = /^[a-zA-Z0-9]*$/;
      return regex.test(control.value) ? null : { alphanumeric: true };
    };
  }

  protected getFieldError(fieldName: keyof UserLogin): string {
    const control = this.loginForm.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      email: 'Correo electrónico inválido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      alphanumeric: 'Solo se permiten letras y números',
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }
}
