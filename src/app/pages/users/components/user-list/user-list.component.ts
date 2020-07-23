import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { User } from 'src/app/core/models';
import { UserService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { EditUserModalComponent } from '../../modals/edit-user-modal/edit-user-modal.component';
import { tap, switchMap, take, takeUntil, filter, map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  users$: Observable<MatTableDataSource<User>>;
  displayedColumns: (keyof User)[] = [
    'email',
    'firstname',
    'lastname',
    'verified',
    'role'
  ];

  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initUsers();
  }

  private initUsers(): void {
    this.userService.loadUsers().pipe(
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe();

    this.users$ = this.userService.users$.pipe(
      filter((users: User[]) => Boolean(users.length)),
      map((users: User[]) => new MatTableDataSource(users)),
    );

  }

  openDialog(action: 'Add', item: User): void {
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      minWidth: '500px',
      data: { action, item, itemText: `${item.firstname} ${item.lastname} ` },
    });

    dialogRef.afterClosed().pipe(
      switchMap((result: any) => {
        if (!!result && result.action === 'Add') {
          return this.userService.createUser(result.item);
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
