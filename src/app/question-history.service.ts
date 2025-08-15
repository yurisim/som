import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionHistoryService {
  private historyUpdatedSource = new ReplaySubject<number>(1);
  historyUpdated$ = this.historyUpdatedSource.asObservable();

  private readonly HISTORY_KEY_PREFIX = 'question_history_';
  private readonly MAX_HISTORY = 2;

  getHistory(questionId: number): boolean[] {
    const historyString = localStorage.getItem(this.HISTORY_KEY_PREFIX + questionId);
    return historyString ? JSON.parse(historyString) : [];
  }

  addAnswer(questionId: number, isCorrect: boolean) {
    const history = this.getHistory(questionId);
    history.push(isCorrect);
    if (history.length > this.MAX_HISTORY) {
      history.shift();
    }
    localStorage.setItem(this.HISTORY_KEY_PREFIX + questionId, JSON.stringify(history));
    this.historyUpdatedSource.next(questionId);
  }

  getMasteredQuestionIds(): Set<number> {
    const masteredQuestionIds = new Set<number>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.HISTORY_KEY_PREFIX)) {
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        if (history.length >= this.MAX_HISTORY && history.every((h: boolean) => h)) {
          masteredQuestionIds.add(Number(key.replace(this.HISTORY_KEY_PREFIX, '')));
        }
      }
    }
    return masteredQuestionIds;
  }

  getIncorrectlyAnsweredQuestions(): number[] {
    const incorrectlyAnswered = new Set<number>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.HISTORY_KEY_PREFIX)) {
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        if (history.some((h: boolean) => !h)) {
          incorrectlyAnswered.add(Number(key.replace(this.HISTORY_KEY_PREFIX, '')));
        }
      }
    }
    return Array.from(incorrectlyAnswered);
  }

  getNumberOfCorrectlyMasteredQuestions(): number {
    return this.getMasteredQuestionIds().size;
  }

  getPerformanceScore(questionIds: number[]): number {
    let totalCorrect = 0;
    let totalAnswered = 0;

    for (const id of questionIds) {
      const history = this.getHistory(id);
      if (history.length > 0) {
        totalCorrect += history.filter(h => h).length;
        totalAnswered += history.length;
      }
    }

    return totalAnswered === 0 ? -1 : totalCorrect / totalAnswered;
  }
}
