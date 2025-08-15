import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Question } from '../quiz/quiz.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { QuestionHistoryService } from '../question-history.service';
import { Subscription } from 'rxjs';

interface ShuffledOption {
  text: string;
  originalIndex: number;
}

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatTooltipModule, MatIconModule],
  templateUrl: './question.html',
  styleUrls: ['./question.scss']
})
export class QuestionComponent implements OnChanges, OnDestroy {
  @Input() question!: Question;
  @Input() questionNumber!: number;
  @Output() answer = new EventEmitter<{ questionId: number, selectedOption: number }>();

  shuffledOptions: ShuffledOption[] = [];
  selectedOption: ShuffledOption | null = null;
  isAnswered = false;
  questionHistory: boolean[] = [];
  isMastered = false;
  private historySubscription: Subscription;

  private questionHistoryService = inject(QuestionHistoryService);

  constructor() {
    this.historySubscription = this.questionHistoryService.historyUpdated$.subscribe(questionId => {
      if (this.question && this.question.id === questionId) {
        this.questionHistory = this.questionHistoryService.getHistory(this.question.id);
        this.updateMasteryStatus();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question'] && this.question) {
      this.isAnswered = this.question.selectedOption !== undefined;
      this.questionHistory = this.questionHistoryService.getHistory(this.question.id);
      this.updateMasteryStatus();
      this.shuffleOptions();
      if (this.isAnswered) {
        this.selectedOption = this.shuffledOptions.find(o => o.originalIndex === this.question.selectedOption) || null;
      }
    }
  }

  private shuffleOptions(): void {
    const optionsWithOriginalIndex = this.question.options.map((text, originalIndex) => ({
      text,
      originalIndex
    }));

    for (let i = optionsWithOriginalIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithOriginalIndex[i], optionsWithOriginalIndex[j]] = [optionsWithOriginalIndex[j], optionsWithOriginalIndex[i]];
    }
    this.shuffledOptions = optionsWithOriginalIndex;
  }

  selectOption(option: ShuffledOption): void {
    if (!this.isAnswered) {
      this.selectedOption = option;
      this.isAnswered = true;
      const isCorrect = this.isCorrect(option);
      this.questionHistoryService.addAnswer(this.question.id, isCorrect);
      this.answer.emit({ questionId: this.question.id, selectedOption: this.selectedOption.originalIndex });
    }
  }

  isCorrect(option: ShuffledOption): boolean {
    return option.originalIndex === this.question.correctOption;
  }

  isIncorrect(option: ShuffledOption): boolean {
    return this.selectedOption === option && !this.isCorrect(option);
  }

  getLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }

  private updateMasteryStatus(): void {
    this.isMastered = this.questionHistory.length >= 2 && this.questionHistory.every(h => h);
  }

  ngOnDestroy(): void {
    this.historySubscription.unsubscribe();
  }


}
