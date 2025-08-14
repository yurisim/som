import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionHistoryService {
  private readonly HISTORY_KEY = 'question_history';
  private readonly MAX_HISTORY = 2;

  getHistory(questionId: number): boolean[] {
    const history = this.getAllHistory();
    return history[questionId] || [];
  }

  addAnswer(questionId: number, isCorrect: boolean) {
    const history = this.getAllHistory();
    if (!history[questionId]) {
      history[questionId] = [];
    }
    history[questionId].push(isCorrect);
    if (history[questionId].length > this.MAX_HISTORY) {
      history[questionId].shift();
    }
    this.saveHistory(history);
  }

  getAllHistory(): { [questionId: number]: boolean[] } {
    const historyString = localStorage.getItem(this.HISTORY_KEY);
    return historyString ? JSON.parse(historyString) : {};
  }

  private saveHistory(history: { [questionId: number]: boolean[] }) {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  getIncorrectlyAnsweredQuestions(): number[] {
    const history = this.getAllHistory();
    return Object.keys(history)
      .map(Number)
      .filter(questionId => {
        const results = history[questionId];
        // Prioritize questions that have been answered incorrectly at least once
        return results.some(result => !result);
      });
  }

  getNumberOfCorrectlyMasteredQuestions(): number {
    const history = this.getAllHistory();
    return Object.keys(history)
      .map(Number)
      .filter(questionId => {
        const results = history[questionId];
        return results.length === this.MAX_HISTORY && results.every(result => result);
      }).length;
  }
}
