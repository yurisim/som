import { Component, OnInit, inject } from '@angular/core';
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
})
export class QuizRunnerComponent implements OnInit {
  private quizService = inject(QuizService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  questions: Question[] = [];
  paginatedQuestions: Question[] = [];
  currentPage = 0;
  questionsPerPage = 10;
  score = 0;
  quizFinished = false;
  completionPercentage = 0;
  missedAreas: { section: string; count: number }[] = [];

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.questionsPerPage);
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const mode = params.get('mode');
      const numQuestions = mode === 'all' ? 'all' : Number(mode);
      this.startNewQuiz(numQuestions);
    });
  }

  startNewQuiz(numQuestions: number | 'all'): void {
    this.clearState();
    this.currentPage = 0;
    this.score = 0;
    this.quizFinished = false;
    this.questions = this.quizService.getQuestions();
    this.shuffleQuestions();
    if (typeof numQuestions === 'number') {
      this.questions = this.questions.slice(0, numQuestions);
    }
    this.setupPage();
    this.saveState();
  }

  shuffleQuestions(): void {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
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
      this.saveState();
    }
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  updateCompletionPercentage(): void {
    this.completionPercentage = ((this.currentPage + 1) / this.totalPages) * 100;
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

  restartQuiz(): void {
    const mode = this.route.snapshot.paramMap.get('mode');
    const numQuestions = mode === 'all' ? 'all' : Number(mode);
    this.startNewQuiz(numQuestions);
  }

  saveState(): void {
    const state = {
      questions: this.questions,
      currentPage: this.currentPage,
      quizFinished: this.quizFinished
    };
    localStorage.setItem('quizState-' + this.route.snapshot.paramMap.get('mode'), JSON.stringify(state));
  }

  loadState(): void {
    const savedState = localStorage.getItem('quizState-' + this.route.snapshot.paramMap.get('mode'));
    if (savedState) {
      const state = JSON.parse(savedState);
      this.questions = state.questions;
      this.currentPage = state.currentPage;
      this.quizFinished = state.quizFinished;
      if (!this.quizFinished) {
        this.setupPage();
      }
    }
  }

  clearState(): void {
    localStorage.removeItem('quizState-' + this.route.snapshot.paramMap.get('mode'));
  }
}
