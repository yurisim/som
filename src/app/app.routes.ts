import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { QuizComponent } from './quiz/quiz';
import { PasswordComponent } from './password/password.component';
import { authGuard } from './auth.guard';
import { QuizRunnerComponent } from './quiz-runner/quiz-runner';
import { QuizModeSelectionComponent } from './quiz-mode-selection/quiz-mode-selection';

export const appRoutes: Route[] = [
  { path: 'login', component: PasswordComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'checklist', component: ChecklistComponent, canActivate: [authGuard] },
  {
    path: 'quiz',
    component: QuizComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: QuizModeSelectionComponent },
      { path: 'run/:mode', component: QuizRunnerComponent },
      { path: 'run/section/:sectionName', component: QuizRunnerComponent }
    ]
  }
];
