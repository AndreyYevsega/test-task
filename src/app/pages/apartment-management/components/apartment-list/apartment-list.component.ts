import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { Observable, Subject, of } from 'rxjs';
import { map, tap, take, takeUntil, filter, switchMap } from 'rxjs/operators';

import { Apartment } from 'src/app/core/models';
import { ApartmentManagementService } from '../../services';
import { EditItemModalComponent } from '../modals/edit-item-modal/edit-item-modal.component';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent implements OnInit, OnDestroy {

  displayedColumns: (keyof Apartment)[] = [
    'name',
    'floorAreaSize',
    'pricePerMonth',
    'numberOfRooms',
    'latitude',
    'longitude',
    'realtor',
    'created',
    'status',
  ];
  apartments$: Observable<MatTableDataSource<Apartment>>;
  private onDestroy$: Subject<void> = new Subject();
  cmp = EditItemModalComponent;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private apartmentService: ApartmentManagementService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initApartments();
  }

  private initApartments(): void {
    this.apartmentService.loadApartments().pipe(
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe();

    this.apartments$ = this.apartmentService.apartments$.pipe(
      filter((apartments: Apartment[]) => Boolean(apartments.length)),
      map((apartments: Apartment[]) => new MatTableDataSource(apartments)),
    );

  }

  openDialog(action: 'Add', item: Apartment): void {
    const dialogRef = this.dialog.open(EditItemModalComponent, {
      minWidth: '500px',
      data: { action, item, itemText: item.name },
    });

    dialogRef.afterClosed().pipe(
      switchMap((result: any) => {
        if (!!result && result.action === 'Add') {
          return this.apartmentService.createApartment(result.item);
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
