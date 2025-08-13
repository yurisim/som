import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.scss'],
})
export class QuizComponent {}
