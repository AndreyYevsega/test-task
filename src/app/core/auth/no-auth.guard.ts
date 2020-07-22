import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap, map, } from 'rxjs/operators';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private authService: AuthService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      tap((isLoggedIn: boolean) => {
        console.log('NoAuthGuard', isLoggedIn);
        if (!!isLoggedIn) {
          this.router.navigate(['/pages']);
        }
      }),
      map((isLoggedIn: boolean) => !isLoggedIn),
    );
  }
}
