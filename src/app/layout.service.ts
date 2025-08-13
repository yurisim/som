import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private showProgressBarSource = new BehaviorSubject<boolean>(false);
  showProgressBar$ = this.showProgressBarSource.asObservable();

  setShowProgressBar(isVisible: boolean): void {
    this.showProgressBarSource.next(isVisible);
  }
}
