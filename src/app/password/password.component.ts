import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() authenticated = new EventEmitter<boolean>();
  password = '';
  showError = false;

  checkPassword() {
    if (this.password.toLowerCase() === 'hoyas' || this.password.toLowerCase() === 'hoya') {
      localStorage.setItem('isAuthenticated', 'true');
      this.authenticated.emit(true);
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
