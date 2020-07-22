import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Apartment, } from 'src/app/core/models';
import { ApiService } from 'src/app/core/api';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApartmentManagementService extends ApiService {
  private apartmentList$: BehaviorSubject<Apartment[]> = new BehaviorSubject([]);
  apartments$: Observable<Apartment[]> = this.apartmentList$.asObservable();

  constructor(
    http$: HttpClient,
  ) {
    super(http$);
    this.loadApartments();
  }

  loadApartments(): void {
    this.get<Apartment[]>('apartments').pipe(
      tap(console.log),
      tap((apartments: Apartment[]) => this.apartmentList$.next(apartments))
    ).subscribe();
  }
}
