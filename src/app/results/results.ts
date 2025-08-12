import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './results.html',
  styleUrls: ['./results.scss']
})
export class ResultsComponent {
  @Input() score = 0;
  @Input() totalQuestions = 0;
  @Output() restart = new EventEmitter<void>();

  onRestart(): void {
    this.restart.emit();
  }
}
