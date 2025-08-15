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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColorKeyDialogComponent } from '../color-key-dialog/color-key-dialog';
import { MasteryExplanationDialogComponent } from '../mastery-explanation-dialog/mastery-explanation-dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-mode-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatListModule, MatTooltipModule, MatCardModule, MatCheckboxModule, MatDialogModule],
  templateUrl: './quiz-mode-selection.html',
  styleUrls: ['./quiz-mode-selection.scss']
})
export class QuizModeSelectionComponent implements OnInit {
  hideMastered = true;

  quizModes = [
    { mode: 10, icon: 'flash_on', title: 'Quickie', line: '10 questions' },
    { mode: 50, icon: 'psychology', title: 'Brain Teaser', line: '50 questions' },
    { mode: 100, icon: 'school', title: 'Scholar', line: '100 questions' },
    { mode: 'incorrect', icon: 'replay', title: 'Prioritize Incorrect', line: 'Focus on missed questions' }
  ];

  sections: { name: string; count: number; performanceColor: string }[] = [];
  private router = inject(Router);
  private quizService = inject(QuizService);
  private questionHistoryService = inject(QuestionHistoryService);
  private dialog = inject(MatDialog);

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

    const allQuestionsForPerformance = this.quizService.getQuestions();

    this.sections = Array.from(sectionsMap.entries()).map(([name, count]) => {
      const allQuestionIdsInSection = allQuestionsForPerformance.filter(q => q.section === name).map(q => q.id);
      const masteredIdsInSection = allQuestionIdsInSection.filter(id => masteredQuestionIds.has(id));
      const nonMasteredIdsInSection = allQuestionIdsInSection.filter(id => !masteredQuestionIds.has(id));

      const nonMasteredPerformance = this.questionHistoryService.getPerformanceScore(nonMasteredIdsInSection);

      // Treat unanswered questions as 0 score. The performance score is a ratio of correct answers.
      // We multiply by the number of questions that have been answered to get a raw score.
      const answeredNonMasteredIds = nonMasteredIdsInSection.filter(id => this.questionHistoryService.getHistory(id).length > 0);
      const nonMasteredScore = nonMasteredPerformance >= 0 ? nonMasteredPerformance * answeredNonMasteredIds.length : 0;

      // Each question is worth 1 point (perfect score). Mastered questions get full points.
      const totalScore = masteredIdsInSection.length + nonMasteredScore;
      const finalPerformance = allQuestionIdsInSection.length > 0 ? totalScore / allQuestionIdsInSection.length : -1;

      const performanceColor = this.getPerformanceColor(finalPerformance);
      return { name, count, performanceColor };
    });
  }

  getPerformanceColor(performance: number): string {
    if (performance < 0) {
      return 'var(--tile-background-color)'; // Default color for no data
    }
    // Convert performance (0-1) to a hue value in HSL (0-120)
    const hue = performance * 120;
    // Using hsla to add a semi-transparent overlay. Adjust saturation and alpha for theming.
    // 50% saturation and 20% alpha should provide a subtle, theme-friendly tint.
    return `hsla(${hue}, 50%, 50%, 0.2)`;
  }

  openColorKeyDialog(): void {
    this.dialog.open(ColorKeyDialogComponent);
  }

  openMasteryExplanationDialog(): void {
    this.dialog.open(MasteryExplanationDialogComponent);
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
