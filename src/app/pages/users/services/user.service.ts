import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/api';
import { User } from 'src/app/core/models/user.model';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

const apiModel = 'users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userList$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  users$: Observable<User[]> = this.userList$.asObservable();

  constructor(
    private apiService: ApiService,
  ) { }

  loadUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(apiModel).pipe(
      tap((users: User[]) => this.userList$.next(users)),
    );
  }

  private loadUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`${apiModel}/` + id);
  }

  getUserById(id: string): Observable<User> {
    return this.users$.pipe(
      map((users: User[]) => users.find((user: User) => user._id === id)),
      switchMap((user: User) => {
        if (!user) {
          return this.loadUserById(id);
        }
        return of(user);
      }));
  }

  createUser(user: User): any {
    return this.apiService.post<User, any>(apiModel, user).pipe(
      tap(() => {
        this.userList$.next([
          ...this.userList$.getValue(),
          user,
        ]);
      })
    );
  }

  updateUser(user: User): any {
    const { _id, ...item } = user;
    return this.apiService.put<Partial<User>, any>(`${apiModel}/${_id}`, item).pipe(
      tap(() => {
        this.userList$.next([
          ...this.userList$.getValue().filter((currentUser: User) => currentUser._id !== currentUser._id),
          user,
        ]);
      })
    );
  }

  deleteUser(user: User): any {
    return this.apiService.delete<User>(`${apiModel}/${user._id}`).pipe(
      tap(() => {
        this.userList$.next([
          ...this.userList$.getValue().filter((currentUser: User) => currentUser._id !== currentUser._id),
        ]);
      })
    );
  }
}
