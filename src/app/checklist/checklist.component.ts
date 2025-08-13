import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ChecklistService } from '../checklist.service';
import { LayoutService } from '../layout.service';
import { KeyValue } from '@angular/common';
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
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent implements OnInit {
  groupedChecklist: GroupedChecklist = {};
  regions: string[] = [];
  sections: { [key: string]: string[] } = {};
  completionPercentage = 0;
  totalItems = 0;
  completedItems = 0;
  filteredGroupedChecklist: GroupedChecklist = {};
  searchQuery = '';

  checklistService = inject(ChecklistService);
  dialog = inject(MatDialog);
  private layoutService = inject(LayoutService);

  // loads data and sets up initial state
  ngOnInit(): void {

    this.checklistService.getChecklistData().subscribe((data) => {
      this.groupedChecklist = this.groupData(data);
      this.filteredGroupedChecklist = this.groupedChecklist;
      this.regions = Object.keys(this.groupedChecklist);
      this.regions.forEach((region) => {
        this.sections[region] = Object.keys(this.groupedChecklist[region]);
      });
      this.calculateCompletionPercentage();
    });
  }



  trackByRegion(index: number, region: string): string {
    return region;
  }

  trackByRegionKey(
    index: number,
    region: KeyValue<string, { [key: string]: ChecklistItem[] }>
  ): string {
    return region.key;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilter();
  }

  // checks if all items in a region are completed
  getCompletedItemsInRegion(region: string): number {
    if (!this.sections[region]) {
      return 0;
    }
    return this.sections[region].reduce((acc, section) => {
      const completedInSection = this.groupedChecklist[region][section].filter(
        (item) => item.checked
      ).length;
      return acc + completedInSection;
    }, 0);
  }

  getTotalItemsInRegion(region: string): number {
    if (!this.sections[region]) {
      return 0;
    }
    return this.sections[region].reduce((acc, section) => {
      return acc + this.groupedChecklist[region][section].length;
    }, 0);
  }

  isRegionComplete(region: string): boolean {
    if (!this.sections[region]) {
      return false;
    }
    return this.sections[region].every((section) =>
      this.groupedChecklist[region][section].every((item) => item.checked)
    );
  }

  getCompletedItemsInSection(region: string, section: string): number {
    if (
      !this.groupedChecklist[region] ||
      !this.groupedChecklist[region][section]
    ) {
      return 0;
    }
    return this.groupedChecklist[region][section].filter((item) => item.checked)
      .length;
  }

  getTotalItemsInSection(region: string, section: string): number {
    if (
      !this.groupedChecklist[region] ||
      !this.groupedChecklist[region][section]
    ) {
      return 0;
    }
    return this.groupedChecklist[region][section].length;
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
    this.sections[region].forEach((section) => {
      this.checkAllInSection(region, section, checked);
    });
    this.calculateCompletionPercentage();
  }

  // unchecks everything in a region
  clearAllInRegion(region: string): void {
    this.sections[region].forEach((section) => {
      this.clearAllInSection(region, section);
    });
    this.calculateCompletionPercentage();
  }

  // resets all checkboxes
  clearAll(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.regions.forEach((region) => {
          this.sections[region].forEach((section) => {
            this.clearAllInSection(region, section);
          });
        });
        this.calculateCompletionPercentage();
      }
    });
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
    this.groupedChecklist[region][section].forEach((item) => {
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
    this.regions.forEach((region) => {
      this.sections[region].forEach((section) => {
        const items = this.groupedChecklist[region][section];
        this.totalItems += items.length;
        this.completedItems += items.filter((item) => item.checked).length;
      });
    });

    // Calculate percentage
    this.completionPercentage =
      this.totalItems > 0
        ? Math.round((this.completedItems / this.totalItems) * 100)
        : 0;
  }

  // scrolls to the top of the page
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  applyFilter(): void {
    const filterValue = this.searchQuery.toLowerCase();
    if (!filterValue) {
      this.filteredGroupedChecklist = this.groupedChecklist;
      return;
    }

    this.filteredGroupedChecklist = {};
    this.regions.forEach((region) => {
      const filteredSections: { [key: string]: ChecklistItem[] } = {};
      let regionHasItems = false;
      this.sections[region].forEach((section) => {
        const filteredItems = this.groupedChecklist[region][section].filter(
          (item) =>
            item.description.toLowerCase().includes(filterValue) ||
            item.bullet.toLowerCase().includes(filterValue)
        );
        if (filteredItems.length > 0) {
          filteredSections[section] = filteredItems;
          regionHasItems = true;
        }
      });
      if (regionHasItems) {
        this.filteredGroupedChecklist[region] = filteredSections;
      }
    });
  }
}
