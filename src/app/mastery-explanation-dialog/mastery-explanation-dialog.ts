import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mastery-explanation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './mastery-explanation-dialog.html',
  styleUrls: ['./mastery-explanation-dialog.scss']
})
export class MasteryExplanationDialogComponent {
  dialogRef = inject(MatDialogRef<MasteryExplanationDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
