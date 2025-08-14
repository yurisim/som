import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../quiz/quiz.service';
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
  sections: { name: string; count: number }[] = [];
  private router = inject(Router);
  private quizService = inject(QuizService);

  ngOnInit(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quizState-')) {
        const activeQuizMode = key.replace('quizState-', '');
        const route = activeQuizMode.includes('section-') 
          ? ['/quiz/run/section', activeQuizMode.replace('section-', '')]
          : ['/quiz/run', activeQuizMode];
        this.router.navigate(route);
        break;
      }
    }
    this.sections = this.quizService.getSections();
  }

  selectMode(mode: number | 'all' | string): void {
    if (typeof mode === 'string' && mode !== 'all') {
      this.router.navigate(['/quiz/run/section', mode]);
    } else {
      this.router.navigate(['/quiz/run', mode]);
    }
  }
}
