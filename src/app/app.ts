import { Component, AfterViewInit } from '@angular/core';
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
export class App implements AfterViewInit {
  protected title = 'som';

  ngAfterViewInit() {
    setTimeout(() => {
      const checklistContainer = document.getElementById('checklist-container');
      if (checklistContainer) {
        const scale = window.innerWidth / checklistContainer.scrollWidth;
        checklistContainer.style.transform = `scale(${scale})`;
        checklistContainer.style.transformOrigin = 'top left';
      }
    }, 1000);
  }
}
