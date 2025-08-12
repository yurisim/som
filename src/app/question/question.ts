import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Question } from '../quiz/quiz.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

interface ShuffledOption {
  text: string;
  originalIndex: number;
}

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './question.html',
  styleUrls: ['./question.scss']
})
export class QuestionComponent implements OnChanges {
  @Input() question!: Question;
  @Output() answer = new EventEmitter<number>();

  shuffledOptions: ShuffledOption[] = [];
  selectedOption: ShuffledOption | null = null;
  isAnswered = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question'] && this.question) {
      this.reset();
      this.shuffleOptions();
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
      this.answer.emit(this.selectedOption.originalIndex);
    }
  }

  isCorrect(option: ShuffledOption): boolean {
    return option.originalIndex === this.question.correctOption;
  }

  isIncorrect(option: ShuffledOption): boolean {
    return this.selectedOption === option && !this.isCorrect(option);
  }

  private reset(): void {
    this.shuffledOptions = [];
    this.selectedOption = null;
    this.isAnswered = false;
  }
}
