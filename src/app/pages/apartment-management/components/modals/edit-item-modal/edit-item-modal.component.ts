import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { tap, take, map, takeUntil, pluck, filter, distinctUntilKeyChanged, debounceTime } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { ConfirmationDialogData, UserRole, User, ApartmentStatus, Apartment, } from 'src/app/core/models';
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

  latitude: number;
  longitude: number;

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
      floorAreaSize: [this.data.item.floorAreaSize, [Validators.required, Validators.pattern('^[0-9]*$'),]],
      pricePerMonth: [this.data.item.pricePerMonth, [Validators.required, Validators.pattern('^[0-9]*$'),]],
      numberOfRooms: [this.data.item.numberOfRooms, [Validators.required, Validators.pattern('^[0-9]*$'),]],
      status: [this.data.item.status, [Validators.required]],
      description: [this.data.item.description, [Validators.required]],
    };

    this.latitude = this.data.item.latitude;
    this.longitude = this.data.item.longitude;

    this.authService.userRole$.pipe(
      tap((userRole: UserRole) => {
        if (!!userRole && userRole === 'admin') {
          formConfig = {
            ...formConfig,
            realtor: ['', [Validators.required]]
          };
        }
        this.form = this.fb.group(formConfig);
        this.form.valueChanges.pipe(
          debounceTime(300),
          filter(Boolean),
          map(({ longitude, latitude, }: Partial<Apartment>) => ({ longitude, latitude, })),
          tap(({ longitude, latitude, }) => {
            this.form.get('longitude').setValue(longitude, { emitEvent: false, });
            this.form.get('latitude').setValue(latitude, { emitEvent: false, });
            this.longitude = longitude;
            this.latitude = latitude;
          }),
          takeUntil(this.onDestroy$),
        ).subscribe();
      }),
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe();

  }

  onMapClick({ coords }: any): void {
    if (!!coords) {
      this.form.get('longitude').setValue(coords.lng, { emitEvent: false, });
      this.form.get('latitude').setValue(coords.lat, { emitEvent: false, });
    }
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
