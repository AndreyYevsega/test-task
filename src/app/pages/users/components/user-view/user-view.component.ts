import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { of, Observable, Subject } from 'rxjs';
import { tap, filter, switchMap, take, takeUntil, map } from 'rxjs/operators';

import { UserService } from '../../services';
import { Apartment, UserRole, User } from 'src/app/core/models';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { EditUserModalComponent } from '../../modals/edit-user-modal/edit-user-modal.component';


@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  private onDestroy$: Subject<void> = new Subject();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.user$ = this.activatedRoute.params.pipe(
      filter(({ id }: { id: string; }) => Boolean(id)),
      switchMap(({ id }: { id: string; }) => {
        return this.userService.getUserById(id);
      }),
    );
  }

  openDialog(action: 'Edit' | 'Delete', item: Apartment): void {
    let dialogRef;
    switch (action) {
      case 'Delete':
        dialogRef = this.dialog.open(ConfirmationModalComponent, {
          minWidth: '500px',
          data: { action, item, itemText: item.name },
        });
        break;
      case 'Edit':
        dialogRef = this.dialog.open(EditUserModalComponent, {
          minWidth: '500px',
          data: { action, item, itemText: item.name },
        });
        break;
    }

    dialogRef.afterClosed().pipe(
      switchMap((result: any) => {
        if (!!result) {
          switch (result.action) {
            case 'Delete':
              return this.userService.deleteUser(result.item).pipe(
                tap(() => {
                  this.router.navigate(['']);
                }),
              );
            case 'Edit':
              return this.userService.updateUser(result.item).pipe(
                tap(() => this.getUser())
              );
          }
        }
        return of();
      }),
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
