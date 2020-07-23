import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, NoAuthGuard, AdminGuard, } from './auth/guards';
import { AuthModule, } from './auth/auth.module';
import { ApiModule, } from './api/api.module';


const GUARDS = [
  AuthGuard,
  NoAuthGuard,
  AdminGuard,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    ApiModule,
  ],
  providers: [
    GUARDS,
  ]
})
export class CoreModule { }
