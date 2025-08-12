import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ChecklistComponent } from './checklist/checklist.component';
import { PasswordComponent } from './password/password.component';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz/quiz';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  imports: [RouterModule, MatButtonModule, ChecklistComponent, PasswordComponent, CommonModule, QuizComponent, MatTabsModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App implements AfterViewInit {
  isAuthenticated = false;

  constructor() {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  }

    protected title = 'som';

  onAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const checklistContainer = document.getElementById('checklist-container');
      if (checklistContainer) {
        const scale = window.innerWidth / checklistContainer.scrollWidth;
        checklistContainer.style.transform = `scale(${scale})`;
        checklistContainer.style.transformOrigin = 'top left';
      }
    }, 1000);
  }
}
