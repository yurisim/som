import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

export interface UnansweredQuestionData {
  unansweredQuestions: { questionNumber: number }[];
}

@Component({
  selector: 'app-unanswered-questions-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatListModule],
  templateUrl: './unanswered-questions-dialog.html',
  styleUrls: ['./unanswered-questions-dialog.scss'],
})
export class UnansweredQuestionsDialogComponent {
  dialogRef = inject(MatDialogRef<UnansweredQuestionsDialogComponent>);
  data: UnansweredQuestionData = inject(MAT_DIALOG_DATA);

}
