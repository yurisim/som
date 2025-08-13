import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class PasswordComponent {
  private authService = inject(AuthService);
  password = '';
  showError = false;

  checkPassword() {
    // The original password was 'hoyas' or 'hoya'.
    if (this.password.toLowerCase() === 'hoyas' || this.password.toLowerCase() === 'hoya') {
      this.authService.login();
      this.showError = false;
    } else {
      this.showError = true;
    }
  }

  tryAgain() {
    this.showError = false;
    this.password = '';
  }
}
