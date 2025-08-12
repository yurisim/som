import { Component, OnInit } from '@angular/core';
import { Question } from '../quiz/quiz.model';
import { QuizService } from './quiz.service';
import { QuestionComponent } from '../question/question';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ResultsComponent } from '../results/results';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuestionComponent, MatButtonModule, ResultsComponent],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.scss']
})
export class QuizComponent implements OnInit {
  questions: Question[] = [];
  currentQuestionIndex = 0;
  score = 0;
  quizFinished = false;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions();
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  onAnswer(selectedOptionIndex: number): void {
    if (selectedOptionIndex === this.currentQuestion.correctOption) {
      this.score++;
    }

    setTimeout(() => {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.quizFinished = true;
      }
    }, 1500); // Wait 1.5 seconds before moving to the next question
  }

  restartQuiz(): void {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.quizFinished = false;
    this.questions = this.quizService.getQuestions(); // Reshuffle if service provides it
  }
}
