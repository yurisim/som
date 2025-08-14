import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../quiz/quiz.service';
import { QuestionHistoryService } from '../question-history.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-quiz-mode-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatListModule, MatTooltipModule],
  templateUrl: './quiz-mode-selection.html',
  styleUrls: ['./quiz-mode-selection.scss']
})
export class QuizModeSelectionComponent implements OnInit {
  sections: { name: string; count: number }[] = [];
  private router = inject(Router);
  private quizService = inject(QuizService);
  private questionHistoryService = inject(QuestionHistoryService);

  masteredQuestions = 0;
  totalQuestions = 0;

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
    this.masteredQuestions = this.questionHistoryService.getNumberOfCorrectlyMasteredQuestions();
    this.totalQuestions = this.quizService.getTotalQuestionsCount();
  }

  selectMode(mode: number | 'all' | string | 'incorrect'): void {
    if (mode === 'incorrect') {
      const incorrectQuestionIds = this.questionHistoryService.getIncorrectlyAnsweredQuestions();
      if (incorrectQuestionIds.length > 0) {
        this.quizService.setPrioritizedQuestions(incorrectQuestionIds);
        this.router.navigate(['/quiz/run', 'incorrect']);
      } else {
        // Handle case where there are no incorrect questions
        alert('No incorrectly answered questions to practice!');
      }
      return;
    }
    this.quizService.setPrioritizedQuestions([]); // Clear any prioritized questions
    if (typeof mode === 'string' && mode !== 'all') {
      this.router.navigate(['/quiz/run/section', mode]);
    } else {
      this.router.navigate(['/quiz/run', mode]);
    }
  }
}
