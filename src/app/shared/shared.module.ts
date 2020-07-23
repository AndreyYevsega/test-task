import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserHasRolesDirective } from './directives/user-has-role.directive';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const DIRECTIVES = [UserHasRolesDirective, ];
const MODULES = [
  MaterialModule,
  FormsModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [
    DIRECTIVES,
    PageNotFoundComponent,
    ConfirmationModalComponent,
  ],
  imports: [
    CommonModule,
    MODULES,
  ],
  exports: [
    MODULES,
    DIRECTIVES,
  ],
  entryComponents: [],
})
export class SharedModule { }
