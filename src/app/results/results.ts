import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../quiz/quiz.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { QuestionComponent } from '../question/question';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    QuestionComponent,
  ],
  templateUrl: './results.html',
  styleUrls: ['./results.scss']
})
export class ResultsComponent {
  displayedColumns: string[] = ['section', 'count'];
  @Input() score = 0;
  @Input() totalQuestions = 0;
  @Input() missedAreas: { section: string; count: number }[] = [];
  @Input() missedQuestions: Question[] = [];
  @Output() restart = new EventEmitter<void>();

  onRestart(): void {
    this.restart.emit();
  }
}
