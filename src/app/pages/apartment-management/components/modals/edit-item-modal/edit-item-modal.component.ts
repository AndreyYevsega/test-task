import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { tap, take, map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { ConfirmationDialogData, UserRole, User, ApartmentStatus, } from 'src/app/core/models';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/pages/users/services';

@Component({
  selector: 'app-edit-item-modal',
  templateUrl: './edit-item-modal.component.html',
  styleUrls: ['./edit-item-modal.component.scss']
})
export class EditItemModalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  realtors$: Observable<User[]>;
  private onDestroy$: Subject<void> = new Subject();
  statusList: ApartmentStatus[] = ['Available', 'Rented'];
  constructor(
    public dialogRef: MatDialogRef<EditItemModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.realtors$ = this.userService.loadUsers().pipe(
      map((users: User[]) => users.filter((user: User): boolean => user.role === 'realtor')),
    );
    this.initForm();
  }

  initForm(): void {
    let formConfig: any = {
      name: [this.data.item.name, [Validators.required]],
      address: [this.data.item.address, [Validators.required]],
      latitude: [this.data.item.latitude, [Validators.required]],
      longitude: [this.data.item.longitude, [Validators.required]],
      floorAreaSize: [this.data.item.floorAreaSize, [Validators.required, Validators.pattern('^[0-9]*$'), ]],
      pricePerMonth: [this.data.item.pricePerMonth, [Validators.required, Validators.pattern('^[0-9]*$'), ]],
      numberOfRooms: [this.data.item.numberOfRooms, [Validators.required, Validators.pattern('^[0-9]*$'), ]],
      status: [this.data.item.status, [Validators.required]],
      description: [this.data.item.description, [Validators.required]],
    };

    this.authService.userRole$.pipe(
      tap((userRole: UserRole) => {
        if (!!userRole && userRole === 'admin') {
          formConfig = {
            ...formConfig,
            realtor: [this.data.item.realtor._id, [Validators.required]]
          };
        }
      }),
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe();

    this.form = this.fb.group(formConfig);

  }

  submit(): void {
    if (!!this.form.valid) {
      this.dialogRef.close({
        action: this.data.action,
        item: {
          ...this.form.value,
          _id: this.data.item._id,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
