import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { fadeInOut } from '../animations';
import { LayoutService } from '../layout.service';
import { ViewportScroller } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuestionComponent } from '../question/question';
import { ResultsComponent } from '../results/results';
import { QuizService } from '../quiz/quiz.service';
import { Question } from '../quiz/quiz.model';

@Component({
  selector: 'app-quiz-runner',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    QuestionComponent,
    ResultsComponent,
  ],
  templateUrl: './quiz-runner.html',
  styleUrls: ['./quiz-runner.scss'],
  animations: [fadeInOut],
})
export class QuizRunnerComponent implements OnInit, OnDestroy {
  private quizService = inject(QuizService);
  private layoutService = inject(LayoutService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  questions: Question[] = [];
  paginatedQuestions: Question[] = [];
  currentPage = 0;
  questionsPerPage = 10;
  score = 0;
  quizFinished = false;
  completionPercentage = 0;
  missedAreas: { section: string; count: number }[] = [];
  quizMode: string | null = null;

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.questionsPerPage);
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  ngOnInit(): void {
    this.layoutService.setShowTopProgressBar(true);

    this.route.paramMap.subscribe(params => {
      const sectionName = params.get('sectionName');
      if (sectionName) {
        this.quizMode = `section-${sectionName}`;
      } else {
        this.quizMode = params.get('mode');
      }

      if (!this.quizMode) {
        this.router.navigate(['/quiz']); // Should not happen, but as a safeguard
        return;
      }

      // Check for any active quiz in localStorage
      let activeQuizKey: string | null = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('quizState-')) {
          activeQuizKey = key;
          break;
        }
      }

      const activeQuizMode = activeQuizKey ? activeQuizKey.replace('quizState-', '') : null;

      // If an active quiz exists and it's not the current one, redirect
      if (activeQuizMode && activeQuizMode !== this.quizMode) {
        const route = activeQuizMode.includes('section-')
          ? ['/quiz/run/section', activeQuizMode.replace('section-', '')]
          : ['/quiz/run', activeQuizMode];
        this.router.navigate(route);
        return;
      }

      // Otherwise, load state or start a new quiz
      if (!this.loadState()) {
        this.startNewQuiz();
      }
    });
  }

  startNewQuiz(): void {
    this.clearState();
    this.currentPage = 0;
    this.score = 0;
    this.quizFinished = false;
    const allQuestions = this.quizService.getQuestions();

    if (this.quizMode?.startsWith('section-')) {
      const section = this.quizMode.replace('section-', '');
      this.questions = allQuestions.filter(q => q.section === section);
    } else if (this.quizMode !== 'all') {
      this.shuffleQuestions(allQuestions);
      this.questions = allQuestions.slice(0, Number(this.quizMode));
    } else {
      this.questions = allQuestions;
    }

    this.shuffleQuestions(this.questions);
    this.shuffleAnswers();
    this.setupPage();
    this.saveState();
  }

  shuffleAnswers(): void {
    this.questions.forEach(q => {
      const correctAnswer = q.options[q.correctOption];
      // Shuffle the options array
      for (let i = q.options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
      }
      // Find the new index of the correct answer and update the question
      q.correctOption = q.options.findIndex(option => option === correctAnswer);
    });
  }

  shuffleQuestions(questions: Question[]): void {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }

  setupPage(): void {
    const start = this.currentPage * this.questionsPerPage;
    const end = start + this.questionsPerPage;
    this.paginatedQuestions = this.questions.slice(start, end);
    this.updateCompletionPercentage();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.setupPage();
      this.saveState();
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.setupPage();
      this.saveState();
    }
  }

  onAnswer(answer: { questionId: number; selectedOption: number }): void {
    const question = this.questions.find(q => q.id === answer.questionId);
    if (question) {
      question.selectedOption = answer.selectedOption;
      this.updateCompletionPercentage();
      this.saveState();
    }
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  updateCompletionPercentage(): void {
    const answeredCount = this.questions.filter(q => q.selectedOption !== undefined).length;
    this.completionPercentage = this.totalQuestions > 0 ? (answeredCount / this.totalQuestions) * 100 : 0;
  }

  submitQuiz(): void {
    this.score = this.questions.filter(q => q.selectedOption === q.correctOption).length;
    this.quizFinished = true;
    this.clearState();

    const incorrectAnswers = this.questions.filter(
      q => q.selectedOption !== q.correctOption && q.selectedOption !== undefined
    );

    const missedAreasMap = new Map<string, number>();
    for (const question of incorrectAnswers) {
      const count = missedAreasMap.get(question.section) || 0;
      missedAreasMap.set(question.section, count + 1);
    }

    this.missedAreas = Array.from(missedAreasMap.entries())
      .map(([section, count]) => ({ section, count }))
      .sort((a, b) => b.count - a.count);
  }

  exitQuiz(): void {
    this.clearState();
    this.router.navigate(['/quiz']);
  }

  ngOnDestroy(): void {
    this.layoutService.setShowTopProgressBar(false);
  }

  restartQuiz(): void {
    this.startNewQuiz();
  }

  saveState(): void {
    const state = {
      questions: this.questions,
      currentPage: this.currentPage,
      quizFinished: this.quizFinished
    };
    if (this.quizMode) {
      localStorage.setItem(`quizState-${this.quizMode}`, JSON.stringify(state));
    }
  }

  loadState(): boolean {
    if (!this.quizMode) return false;
    const savedState = localStorage.getItem(`quizState-${this.quizMode}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      this.questions = state.questions;
      this.currentPage = state.currentPage;
      this.quizFinished = state.quizFinished;
      if (!this.quizFinished) {
        this.setupPage();
      }
      return true;
    }
    return false;
  }

  clearState(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quizState-')) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  }
}
