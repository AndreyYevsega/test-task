import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User, ConfirmationDialogData, UserRole } from 'src/app/core/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from '../../services';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  roles: UserRole[] = ['client', 'realtor'];
  private onDestroy$: Subject<void> = new Subject();
  constructor(
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {

    this.form = this.fb.group({
      firstname: [this.data.item.firstname, [Validators.required]],
      lastname: [this.data.item.lastname, [Validators.required]],
      email: [this.data.item.email, [Validators.required]],
      verified: [this.data.item.verified, [Validators.required]],
      role: [this.data.item.role, [Validators.required, ]],
      password: ['', [Validators.required, ]],
    });
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
