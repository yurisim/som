import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-quiz-mode-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './quiz-mode-selection.html',
  styleUrls: ['./quiz-mode-selection.scss']
})
export class QuizModeSelectionComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quizState-')) {
        const activeQuizMode = key.replace('quizState-', '');
        this.router.navigate(['/quiz/run', activeQuizMode]);
        break;
      }
    }
  }

  selectMode(numQuestions: number | 'all'): void {
    this.router.navigate(['/quiz/run', numQuestions]);
  }
}
