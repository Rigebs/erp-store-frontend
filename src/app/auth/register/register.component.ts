import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterRequest } from '../models/register-request';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationUtilService } from '../../utils/notification-util.service';

@Component({
  selector: 'app-register',
  imports: [
    MatInputModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationUtilService: NotificationUtilService
  ) {}

  onSubmit(): void {
    if (!this.validateFields()) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notificationUtilService.showMessage('Las contraseñas no coinciden.');
      return;
    }

    const registerRequest: RegisterRequest = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/auth/login']);
        this.notificationUtilService.showMessage(response.message);
      },
      error: (err) => {
        this.notificationUtilService.showMessage(
          'Error al registrar el usuario. Intente nuevamente.'
        );
        console.error('Error de registro', err);
      },
    });
  }

  validateFields() {
    if (
      !this.username ||
      !this.password ||
      !this.confirmPassword ||
      !this.email
    ) {
      this.notificationUtilService.showMessage(
        'Por favor, ingresa tus credenciales'
      );
      return false;
    }
    return true;
  }

  goBack() {
    this.router.navigateByUrl('/auth/login');
  }
}
