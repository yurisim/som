import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private showTopProgressBarSource = new BehaviorSubject<boolean>(false);
  showTopProgressBar$ = this.showTopProgressBarSource.asObservable();

  setShowTopProgressBar(isVisible: boolean): void {
    this.showTopProgressBarSource.next(isVisible);
  }
}
