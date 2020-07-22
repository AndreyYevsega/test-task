import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard } from './auth/auth.guard';
import { NoAuthGuard } from './auth/no-auth.guard';
import { AuthModule, } from './auth/auth.module';
import { ApiModule, } from './api/api.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    ApiModule,
  ],
  providers: [
    AuthGuard,
    NoAuthGuard,
  ]
})
export class CoreModule { }
