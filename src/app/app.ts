import { Component, inject } from '@angular/core';
import { LayoutService } from './layout.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationComponent } from './navigation/navigation.component';



@Component({
  imports: [RouterModule, NavigationComponent, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected title = 'Dorm Inspection/Quiz';
  isHomePage = false;
  showProgressBar = false;
  private router = inject(Router);
  private layoutService = inject(LayoutService);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomePage = ['/', '/login'].includes(event.urlAfterRedirects);
        this.layoutService.setMainToolbarVisible(!this.isHomePage);
      });

    this.layoutService.showProgressBar$.subscribe(isVisible => {
      this.showProgressBar = isVisible;
    });
  }
}
