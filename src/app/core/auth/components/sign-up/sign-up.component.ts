import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth.service';
import { takeUntil } from 'rxjs/operators';
import { SignUpInput } from 'src/app/core/models';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  @Input() error: string | null;

  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void { }

  submit(): void {
    if (this.form.valid) {
      this.authService.login(new SignUpInput(this.form.value)).pipe(
        takeUntil(this.onDestroy$),
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
