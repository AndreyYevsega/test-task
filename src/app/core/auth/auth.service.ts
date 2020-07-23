import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { SignInInput, AuthResponse, UserRole, User, UserData } from '../models';
import { Router } from '@angular/router';
import { ApiService } from '../api';

const JWT_TOKEN = '_token';
const CURRENT_USER = '_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  user$: BehaviorSubject<User> = new BehaviorSubject(null);
  userRole$ = this.user$.asObservable().pipe(map((user: User): UserRole => user.role));

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.checkAuth();
  }

  private checkAuth(): void {
    try {
      const user: User = JSON.parse(localStorage.getItem(CURRENT_USER));
      if (!user) { throw Error('User is not authenticated.'); }
      this.user$.next(user);
      const token = this.getToken();
      this.isLoggedIn$.next(!!token);

    } catch (error) {
    }
  }

  private storeUser({ user, token, }: UserData): void {
    localStorage.setItem(CURRENT_USER, JSON.stringify(user));
    this.user$.next(user);

    localStorage.setItem(JWT_TOKEN, token);
    this.isLoggedIn$.next(!!token);
  }

  getToken(): string {
    return localStorage.getItem(JWT_TOKEN);
  }

  login(input: SignInInput): Observable<any> {
    return this.apiService.post<SignInInput, UserData>('users/login', input).pipe(
      // tap(({ success, data }: AuthResponse) => {
      //   if (!!success && !!data?.token && !!data?.user) {
      //     this.storeUser(data);
      //     this.router.navigate(['/']);
      //   }
      // })
      tap(({ token, user }: UserData) => {
        if (!!token && !!user) {
          this.storeUser({ token, user });
          this.router.navigate(['/']);
        }
      })
    );
  }

}
