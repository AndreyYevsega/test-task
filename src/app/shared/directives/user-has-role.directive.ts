import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from 'src/app/core/models';

@Directive({
  selector: '[appUserHasRoles]'
})
export class UserHasRoleDirective implements OnInit, OnDestroy {
  @Input() appUserHasRoles: string[];
  onDestroy$: Subject<void> = new Subject();
  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.userRole$.pipe(takeUntil(this.onDestroy$)).subscribe((role: UserRole) => {
      if (!role) {
        this.viewContainerRef.clear();
      }

      if (this.appUserHasRoles.includes(role)) {
        if (!this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      } else {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
