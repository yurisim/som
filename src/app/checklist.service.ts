import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { ChecklistItem } from './checklist.model';
import checklistData from './data.json';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  private checklistData: ChecklistItem[] = checklistData;

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
