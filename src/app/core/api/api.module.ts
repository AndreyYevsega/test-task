import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';
import { ErrorInterceptor } from './error.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ]
})
export class ApiModule { }
