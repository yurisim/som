import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChecklistService } from '../checklist.service';
import { ChecklistItem, GroupedChecklist } from '../checklist.model';




@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    FormsModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {
  groupedChecklist: GroupedChecklist = {};
  regions: string[] = [];
  sections: { [region: string]: string[] } = {};
  regionCollapsedState: { [region: string]: boolean } = {};
  completionPercentage = 0;
  totalItems = 0;
  completedItems = 0;

  checklistService = inject(ChecklistService);

  // loads data and sets up initial state
ngOnInit(): void {
    this.checklistService.getChecklistData().subscribe(data => {
      this.groupedChecklist = this.groupData(data);
      this.regions = Object.keys(this.groupedChecklist);
      this.regions.forEach(region => {
        this.sections[region] = Object.keys(this.groupedChecklist[region]);
        this.regionCollapsedState[region] = false; // Default to expanded
      });
      this.calculateCompletionPercentage();
    });
  }

  // expands/collapses a region
toggleRegion(region: string): void {
    this.regionCollapsedState[region] = !this.regionCollapsedState[region];
  }

  // helps Angular's ngFor performance
trackByRegion(index: number, region: string): string {
    return region;
  }

  // organizes flat data into nested structure by region and section
private groupData(data: ChecklistItem[]): GroupedChecklist {
    return data.reduce((acc, item) => {
      acc[item.region] = acc[item.region] || {};
      acc[item.region][item.section] = acc[item.region][item.section] || [];
      acc[item.region][item.section].push(item);
      return acc;
    }, {} as GroupedChecklist);
  }



  // updates checkbox state and recalculates completion %
  onCheckboxChange(checked: boolean, id: string): void {
    this.checklistService.setCheckedState(id, checked);
    this.calculateCompletionPercentage();
  }

  // checks/unchecks all items in a region
checkAllInRegion(region: string, checked: boolean): void {
    this.sections[region].forEach(section => {
      this.checkAllInSection(region, section, checked);
    });
    this.calculateCompletionPercentage();
  }

  // unchecks everything in a region
clearAllInRegion(region: string): void {
    this.sections[region].forEach(section => {
      this.clearAllInSection(region, section);
    });
    this.calculateCompletionPercentage();
  }

  // resets all checkboxes
clearAll(): void {
    this.regions.forEach(region => {
      this.sections[region].forEach(section => {
        this.clearAllInSection(region, section);
      });
    });
    this.calculateCompletionPercentage();
  }

  // bulk check/uncheck for a section
checkAllInSection(region: string, section: string, checked: boolean): void {
    this.groupedChecklist[region][section].forEach((item) => {
      if (item.checked !== checked) {
        item.checked = checked;
        this.checklistService.setCheckedState(item.id, checked);
      }
    });
    this.calculateCompletionPercentage();
  }

  // unchecks all items in a section
clearAllInSection(region: string, section: string): void {
    this.groupedChecklist[region][section].forEach(item => {
      if (item.checked) {
        item.checked = false;
        this.checklistService.setCheckedState(item.id, false);
      }
    });
    this.calculateCompletionPercentage();
  }

  // figures out how much is done
calculateCompletionPercentage(): void {
    this.totalItems = 0;
    this.completedItems = 0;
    
    // Count total and completed items
    this.regions.forEach(region => {
      this.sections[region].forEach(section => {
        const items = this.groupedChecklist[region][section];
        this.totalItems += items.length;
        this.completedItems += items.filter(item => item.checked).length;
      });
    });
    
    // Calculate percentage
    this.completionPercentage = this.totalItems > 0 ? 
      Math.round((this.completedItems / this.totalItems) * 100) : 0;
  }

  // scrolls to the top of the page
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
