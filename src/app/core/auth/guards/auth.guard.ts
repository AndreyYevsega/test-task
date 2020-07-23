import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  CanLoad
} from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { tap, } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly router: Router,
    private authService: AuthService,
  ) { }

  private checkIsLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      tap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }

  canActivate(): Observable<boolean> {
    return this.checkIsLoggedIn();
  }

  canLoad(): Observable<boolean> {
    return this.checkIsLoggedIn();
  }
}
