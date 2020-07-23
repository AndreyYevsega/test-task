import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { of, Observable, Subject } from 'rxjs';
import { tap, filter, switchMap, take, takeUntil, map } from 'rxjs/operators';

import { ApartmentManagementService } from '../../services';
import { EditItemModalComponent } from '../modals/edit-item-modal/edit-item-modal.component';
import { Apartment, UserRole, User } from 'src/app/core/models';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-apartment-view',
  templateUrl: './apartment-view.component.html',
  styleUrls: ['./apartment-view.component.scss']
})
export class ApartmentViewComponent implements OnInit, OnDestroy {
  apartment$: Observable<Apartment>;
  private onDestroy$: Subject<void> = new Subject();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apartmentService: ApartmentManagementService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getApartment();
  }

  getApartment(): void {
    this.apartment$ = this.activatedRoute.params.pipe(
      filter(({ id }: { id: string; }) => Boolean(id)),
      switchMap(({ id }: { id: string; }) => {
        return this.apartmentService.getApartmentById(id);
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
        dialogRef = this.dialog.open(EditItemModalComponent, {
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
              return this.apartmentService.deleteApartment(result.item).pipe(
                tap(() => {
                  this.router.navigate(['']);
                }),
              );
            case 'Edit':
              return this.apartmentService.updateApartment(result.item).pipe(
                tap(() => this.getApartment())
              );
          }
        }
        return of();
      }),
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe();
  }

  userHasEditPermission({ realtor }: Partial<Apartment>): Observable<boolean> {
    return this.authService.user$.pipe(
      map((user: User) => {
        if (user.role === 'admin') {
          return true;
        }
        if (user.role === 'realtor' && realtor._id === user._id) {
          return true;
        }
        return false;
      }),
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
