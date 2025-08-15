import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-key-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './color-key-dialog.html',
  styleUrls: ['./color-key-dialog.scss']
})
export class ColorKeyDialogComponent {
  dialogRef = inject(MatDialogRef<ColorKeyDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
