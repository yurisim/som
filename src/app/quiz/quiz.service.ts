import { Injectable } from '@angular/core';
import { Question } from './quiz.model';
import questionsData from '../questions.json';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = questionsData.questions;
  private prioritizedQuestionIds: number[] = [];

  getSections(): { name: string; count: number }[] {
    const sectionCounts = this.questions.reduce((acc, question) => {
      acc[question.section] = (acc[question.section] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(sectionCounts)
      .map(name => ({
        name,
        count: sectionCounts[name]
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getTotalQuestionsCount(): number {
    return this.questions.length;
  }

  getQuestions(): Question[] {
    // Deep copy to prevent modification of the original data
    return JSON.parse(JSON.stringify(this.questions));
  }

  setPrioritizedQuestions(questionIds: number[]): void {
    this.prioritizedQuestionIds = questionIds;
  }

  getPrioritizedQuestions(): number[] {
    return this.prioritizedQuestionIds;
  }
}
