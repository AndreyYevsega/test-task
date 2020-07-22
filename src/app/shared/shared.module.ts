import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserHasRoleDirective } from './directives/user-has-role.directive';

const DIRECTIVES = [UserHasRoleDirective, ];

@NgModule({
  declarations: [
    // DIRECTIVES,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    MaterialModule,
  ],
})
export class SharedModule { }
