import { Route } from '@angular/router';
import { ChecklistComponent } from './checklist/checklist.component';
import { QuizComponent } from './quiz/quiz';
import { QuizRunnerComponent } from './quiz-runner/quiz-runner';
import { QuizModeSelectionComponent } from './quiz-mode-selection/quiz-mode-selection';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/checklist', pathMatch: 'full' },
  { path: 'checklist', component: ChecklistComponent },
  {
    path: 'quiz',
    component: QuizComponent,
    children: [
      { path: '', component: QuizModeSelectionComponent },
      { path: 'run/:mode', component: QuizRunnerComponent }
    ]
  }
];
