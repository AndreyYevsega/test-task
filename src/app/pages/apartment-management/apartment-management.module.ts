import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApartmentListComponent } from './components/apartment-list/apartment-list.component';
import { RouterModule, Route } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApartmentManagementService } from './services';

const routes: Route[] = [
  {
    path: '',
    component: ApartmentListComponent,
  }
];

@NgModule({
  declarations: [ApartmentListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [
    ApartmentManagementService,
  ],
})
export class ApartmentManagementModule { }
