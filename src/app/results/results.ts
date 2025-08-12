import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTableModule],
  templateUrl: './results.html',
  styleUrls: ['./results.scss']
})
export class ResultsComponent {
  displayedColumns: string[] = ['section', 'count'];
  @Input() score = 0;
  @Input() totalQuestions = 0;
  @Input() missedAreas: { section: string; count: number }[] = [];
  @Output() restart = new EventEmitter<void>();

  onRestart(): void {
    this.restart.emit();
  }
}
