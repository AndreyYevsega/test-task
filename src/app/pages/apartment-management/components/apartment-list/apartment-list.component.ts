import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Apartment } from 'src/app/core/models';
import { create } from 'domain';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApartmentManagementService } from '../../services';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent implements OnInit {

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
  dataSource: MatTableDataSource<Apartment>;
  apartments$: Observable<MatTableDataSource<Apartment[]>>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private apartmentService: ApartmentManagementService,
  ) { }

  ngOnInit(): void {
    this.apartments$ = this.apartmentService.apartments$.pipe(
      tap(console.log),
      map((apartments: Apartment[]) => new MatTableDataSource(apartments)),
      tap(console.log),
    );
    // this.apartmentService.loadApartments().subscribe((apartments: Apartment[]) => {
    //   console.log('APARTMENTS', apartments);
    //   this.dataSource = new MatTableDataSource(apartments);
    // });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
