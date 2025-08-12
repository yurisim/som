import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ChecklistComponent } from './checklist/checklist.component';
import { PasswordComponent } from './password/password.component';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz/quiz';
import { NavigationComponent } from './navigation/navigation.component';


@Component({
  imports: [RouterModule, MatButtonModule, ChecklistComponent, PasswordComponent, CommonModule, QuizComponent, NavigationComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App implements AfterViewInit {
  @ViewChild(QuizComponent) quizComponent: QuizComponent;
  isAuthenticated = false;
  selectedView: 'checklist' | 'quiz' = 'checklist';

  constructor() {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  }

    protected title = 'Dorm Inspection/Quiz';

  onAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  onViewSelected(view: 'checklist' | 'quiz') {
    this.selectedView = view;
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
