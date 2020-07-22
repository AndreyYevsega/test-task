import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http$: HttpClient,
  ) { }

  protected get<T>(path: string): Observable<T> {
    return this.http$.get<ApiResponse<T>>(path).pipe(
      // map((response: any) => {
      //   return response.data;
      // }),
      map(this.mapResponseToData),
    );
  }

  protected post<T, K>(path: string, payload: T): Observable<K> {
    return this.http$.post<ApiResponse<K>>(path, payload).pipe(
      map(this.mapResponseToData),
    );
  }

  private mapResponseToData<T>({ success, data }: ApiResponse<T>): T {
    if (!!success) {
      return data;
    }
    throw Error('API Error');
  }
}
