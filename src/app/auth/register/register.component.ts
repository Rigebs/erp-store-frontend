import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterRequest } from '../models/register-request';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [MatInputModule, FormsModule, CommonModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  registrationError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    // Asegurarse de que el username, email, y password estén correctamente configurados.
    const registerRequest: RegisterRequest = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/auth/login']);
        console.log(response.message);
      },
      error: (err) => {
        this.registrationError =
          'Error al registrar el usuario. Intente nuevamente.';
        console.error('Error de registro', err);
      },
    });
  }
}
