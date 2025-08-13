import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  imports: [MatButtonModule, CommonModule, RouterModule]
})
export class NavigationComponent {}
