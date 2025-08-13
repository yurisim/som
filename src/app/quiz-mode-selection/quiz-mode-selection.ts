import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quiz-mode-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './quiz-mode-selection.html',
  styleUrls: ['./quiz-mode-selection.scss']
})
export class QuizModeSelectionComponent {
  private router = inject(Router);

  selectMode(numQuestions: number | 'all'): void {
    this.router.navigate(['/quiz/run', numQuestions]);
  }
}
