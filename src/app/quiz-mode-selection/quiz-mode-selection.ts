import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../quiz/quiz.service';
import { QuestionHistoryService } from '../question-history.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-mode-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatListModule, MatTooltipModule, MatCardModule, MatCheckboxModule],
  templateUrl: './quiz-mode-selection.html',
  styleUrls: ['./quiz-mode-selection.scss']
})
export class QuizModeSelectionComponent implements OnInit {
  hideMastered = true;

  quizModes = [
    { mode: 10, icon: 'flash_on', title: 'Quickie', line: '10 questions' },
    { mode: 50, icon: 'psychology', title: 'Brain Teaser', line: '50 questions' },
    { mode: 100, icon: 'school', title: 'Scholar', line: '100 questions' },
    { mode: 'all', icon: 'fitness_center', title: 'Marathon', line: 'All questions' },
    { mode: 'incorrect', icon: 'replay', title: 'Prioritize Incorrect', line: 'Focus on missed questions' }
  ];

  sections: { name: string; count: number }[] = [];
  private router = inject(Router);
  private quizService = inject(QuizService);
  private questionHistoryService = inject(QuestionHistoryService);

  masteredQuestions = 0;
  totalQuestions = 0;

  ngOnInit(): void {
    const savedHideMastered = localStorage.getItem('hideMastered');
    this.hideMastered = savedHideMastered !== null ? JSON.parse(savedHideMastered) : true;
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
    this.updateSections();
  }

  updateSections(): void {
    localStorage.setItem('hideMastered', JSON.stringify(this.hideMastered));
    this.masteredQuestions = this.questionHistoryService.getNumberOfCorrectlyMasteredQuestions();
    const masteredQuestionIds = this.questionHistoryService.getMasteredQuestionIds();

    let allQuestions = this.quizService.getQuestions();
    this.totalQuestions = allQuestions.length;

    if (this.hideMastered) {
      allQuestions = allQuestions.filter(q => !masteredQuestionIds.has(q.id));
    }

    const sectionsMap = new Map<string, number>();
    for (const question of allQuestions) {
      sectionsMap.set(question.section, (sectionsMap.get(question.section) || 0) + 1);
    }

    this.sections = Array.from(sectionsMap.entries()).map(([name, count]) => ({ name, count }));
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
    const queryParams = { hideMastered: this.hideMastered };

    if (typeof mode === 'string' && !isNaN(Number(mode))) {
      this.router.navigate(['/quiz/run', mode], { queryParams });
    } else if (typeof mode === 'string') {
      this.router.navigate(['/quiz/run/section', mode], { queryParams });
    } else {
      this.router.navigate(['/quiz/run', mode], { queryParams });
    }
  }
}
