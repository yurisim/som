import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private showProgressBarSource = new BehaviorSubject<boolean>(false);
  showProgressBar$ = this.showProgressBarSource.asObservable();

  private mainToolbarVisibleSource = new BehaviorSubject<boolean>(true);
  mainToolbarVisible$ = this.mainToolbarVisibleSource.asObservable();

  setShowProgressBar(isVisible: boolean): void {
    this.showProgressBarSource.next(isVisible);
  }

  setMainToolbarVisible(isVisible: boolean) {
    this.mainToolbarVisibleSource.next(isVisible);
  }
}
