import { Injectable } from '@angular/core';
import { Question } from './quiz.model';
import questionsData from '../questions.json';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = questionsData.questions;

  getQuestions(): Question[] {
    // Deep copy to prevent modification of the original data
    return JSON.parse(JSON.stringify(this.questions));
  }
}
