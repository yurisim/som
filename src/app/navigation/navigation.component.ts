import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  imports: [MatButtonModule, CommonModule]
})
export class NavigationComponent {
  @Input() selectedView: 'checklist' | 'quiz' = 'checklist';
  @Output() viewSelected = new EventEmitter<'checklist' | 'quiz'>();

  selectView(view: 'checklist' | 'quiz') {
    this.viewSelected.emit(view);
  }
}
