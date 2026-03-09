import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authStorageKey = 'task-tracker-auth';
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.readFromStorage());

  readonly isLoggedIn$ = this.loggedInSubject.asObservable();

  get isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  setLoggedIn(value: boolean): void {
    this.loggedInSubject.next(value);
    localStorage.setItem(this.authStorageKey, JSON.stringify(value));
  }

  toggle(): void {
    this.setLoggedIn(!this.isLoggedIn);
  }

  private readFromStorage(): boolean {
    const saved = localStorage.getItem(this.authStorageKey);
    return saved ? JSON.parse(saved) : true;
  }
}
