import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ChecklistComponent } from './checklist/checklist.component';

@Component({
  imports: [RouterModule, MatButtonModule, ChecklistComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected title = 'som';
}
