import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  CanLoad
} from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { map, } from 'rxjs/operators';
import { UserRole } from '../../models';

@Injectable()
export class AdminGuard implements CanActivate, CanLoad {
  constructor(
    private readonly router: Router,
    private authService: AuthService,
  ) { }

  private checkIsAdminRole(): Observable<boolean> {
    return this.authService.userRole$.pipe(
      map((userRole: UserRole) => {
        if (userRole === 'admin') {
          return true;
        }
        return false;
      })
    );
  }

  canActivate(): Observable<boolean> {
    return this.checkIsAdminRole();
  }

  canLoad(): Observable<boolean> {
    return this.checkIsAdminRole();
  }
}
