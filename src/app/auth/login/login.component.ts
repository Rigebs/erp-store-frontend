import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request';
import { JwtUtilService } from '../../utils/jwt-util.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtUtilService: JwtUtilService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.showNotification(
        'Por favor, ingresa tus credenciales',
        'Cerrar',
        3000
      );
      return;
    }
    const loginRequest: LoginRequest = {
      email: this.username,
      password: this.password,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.jwtUtilService.saveToken(response.token);
        this.showNotification('Inicio de sesión exitoso', 'Cerrar', 3000);
        this.router.navigate(['/management/products']);
      },
      error: (err) => {
        if (err.error.details === 'Bad credentials') {
          this.showNotification('Contraseña inválida', 'Cerrar', 3000);
          return;
        }
        this.showNotification(err.error.details, 'Cerrar', 3000);
      },
    });
  }

  private showNotification(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration,
    });
  }
}
