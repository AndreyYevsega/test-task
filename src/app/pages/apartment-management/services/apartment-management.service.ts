import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Apartment, } from 'src/app/core/models';
import { ApiService } from 'src/app/core/api';
import { tap, map, switchMap } from 'rxjs/operators';

const apiModel = 'apartments';

@Injectable({
  providedIn: 'root'
})
export class ApartmentManagementService {
  private apartmentList$: BehaviorSubject<Apartment[]> = new BehaviorSubject([]);
  apartments$: Observable<Apartment[]> = this.apartmentList$.asObservable();

  constructor(
    private apiService: ApiService,
  ) { }

  loadApartments(): Observable<Apartment[]> {
    return this.apiService.get<Apartment[]>(apiModel).pipe(
      tap((apartments: Apartment[]) => this.apartmentList$.next(apartments))
    );
  }

  private loadApartmentById(id: string): Observable<Apartment> {
    return this.apiService.get(`${apiModel}/` + id);
  }

  getApartmentById(id: string): Observable<Apartment> {
    return this.apartments$.pipe(
      map((apartments: Apartment[]) => apartments.find((apartment: Apartment) => apartment._id === id)),
      switchMap((apartment: Apartment) => {
        if (!apartment) {
          return this.loadApartmentById(id);
        }
        return of(apartment);
      }));
  }

  createApartment(apartment: Apartment): any {
    return this.apiService.post<Apartment, any>(apiModel, apartment).pipe(
      tap(() => {
        this.apartmentList$.next([
          ...this.apartmentList$.getValue(),
          apartment,
        ]);
      })
    );
  }

  updateApartment(apartment: Apartment): any {
    const { _id, ...item } = apartment;
    return this.apiService.put<Partial<Apartment>, any>(`${apiModel}/${_id}`, item).pipe(
      tap(() => {
        this.apartmentList$.next([
          ...this.apartmentList$.getValue().filter((currentApartment: Apartment) => currentApartment._id !== apartment._id),
          apartment,
        ]);
      })
    );
  }

  deleteApartment(apartment: Apartment): any {
    return this.apiService.delete<Apartment>(`${apiModel}/${apartment._id}`).pipe(
      tap(() => {
        this.apartmentList$.next([
          ...this.apartmentList$.getValue().filter((currentApartment: Apartment) => currentApartment._id !== apartment._id),
        ]);
      })
    );
  }
}
