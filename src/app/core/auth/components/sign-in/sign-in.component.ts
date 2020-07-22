import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService, } from '../../auth.service';
import { SignInInput } from 'src/app/core/models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email, ]),
    password: new FormControl('', [ Validators.required ]),
  });

  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();

  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void { }

  submit(): void {
    if (this.form.valid) {
      this.authService.login(new SignInInput(this.form.value)).pipe(
        takeUntil(this.onDestroy$),
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
