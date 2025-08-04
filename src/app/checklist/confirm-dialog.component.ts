import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Are you sure?</h1>
    <div mat-dialog-content>
      <p>This action will uncheck all items. This cannot be undone.</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        Confirm
      </button>
    </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialogComponent {
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
