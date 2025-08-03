import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { ChecklistItem } from './checklist.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  private checklistData: ChecklistItem[] = [
    {
      "id": "common_area_floor_001",
      "region": "Common Area (Bathroom/Latrine)",
      "section": "Floor",
      "description": "Remove all trash/debris",
      "page": 9,
      "bullet": "4.3"
    },
    {
      "id": "common_area_floor_002",
      "region": "Common Area (Bathroom/Latrine)",
      "section": "Floor",
      "description": "Tile floors must be dusted, swept, and mopped",
      "page": 9,
      "bullet": "4.3"
    },
    {
      "id": "common_area_walls_001",
      "region": "Common Area (Bathroom/Latrine)",
      "section": "Walls",
      "description": "Spot clean walls, doors, and doorframes",
      "page": 10,
      "bullet": "4.4"
    }
  ];

  getChecklistData(): Observable<ChecklistItem[]> {
    const data = this.checklistData.map(item => ({
      ...item,
      checked: this.getCheckedState(item.id)
    }));
    return of(data);
  }

  getCheckedState(id: string): boolean {
    return localStorage.getItem(id) === 'true';
  }

  setCheckedState(id: string, state: boolean): void {
    localStorage.setItem(id, state.toString());
  }
}
