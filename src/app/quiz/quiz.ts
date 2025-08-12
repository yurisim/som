import { Component, OnInit, inject } from '@angular/core';
import { Question } from '../quiz/quiz.model';
import { QuizService } from './quiz.service';
import { QuestionComponent } from '../question/question';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ResultsComponent } from '../results/results';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-quiz',
  standalone: true,
    imports: [CommonModule, QuestionComponent, MatButtonModule, ResultsComponent, MatProgressBarModule, MatTableModule],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.scss'],
})
export class QuizComponent implements OnInit {
  private quizService = inject(QuizService);

  questions: Question[] = [];
  paginatedQuestions: Question[] = [];
  currentPage = 0;
  questionsPerPage = 20;
  score = 0;
  quizFinished = false;
  missedAreas: { section: string; count: number }[] = [];
  displayedColumns: string[] = ['section', 'count'];

  get answeredQuestions(): number {
    return this.questions.filter(q => q.selectedOption !== undefined).length;
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  get completionPercentage(): number {
    if (this.totalQuestions === 0) {
      return 0;
    }
    return Math.round((this.answeredQuestions / this.totalQuestions) * 100);
  }

  ngOnInit(): void {
    this.loadState();
    if (this.questions.length === 0) {
      this.startNewQuiz();
    }
    this.setupPage();
  }

  private shuffleQuestions(): void {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
    }
  }

  setupPage(): void {
    const startIndex = this.currentPage * this.questionsPerPage;
    const endIndex = startIndex + this.questionsPerPage;
    this.paginatedQuestions = this.questions.slice(startIndex, endIndex);
  }

  onAnswer(payload: { questionId: number; selectedOption: number }): void {
    const question = this.questions.find(q => q.id === payload.questionId);
    if (question) {
      question.selectedOption = payload.selectedOption;
      this.saveState();
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.questionsPerPage < this.questions.length) {
      this.currentPage++;
      this.setupPage();
      this.saveState();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.setupPage();
      this.saveState();
    }
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

  private saveState(): void {
    const state = {
      questions: this.questions,
      currentPage: this.currentPage
    };
    localStorage.setItem('quizState', JSON.stringify(state));
  }

  private loadState(): void {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.questions = state.questions;
      this.currentPage = state.currentPage;
    }
  }

  private clearState(): void {
    localStorage.removeItem('quizState');
  }

  isLastPage(): boolean {
    return (this.currentPage + 1) * this.questionsPerPage >= this.questions.length;
  }

  restartQuiz(): void {
    this.startNewQuiz();
  }

  startNewQuiz(): void {
    this.clearState();
    this.currentPage = 0;
    this.score = 0;
    this.quizFinished = false;
    this.questions = this.quizService.getQuestions();
    this.shuffleQuestions();
    this.questions = this.questions.slice(0, 5);
    this.setupPage();
  }
}
