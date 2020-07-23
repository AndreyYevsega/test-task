import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApartmentListComponent } from './components/apartment-list/apartment-list.component';
import { RouterModule, Route } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApartmentManagementService } from './services';
import { ApartmentViewComponent } from './components/apartment-view/apartment-view.component';
import { EditItemModalComponent } from './components/modals/edit-item-modal/edit-item-modal.component';
import { AgmCoreModule } from '@agm/core';

const routes: Route[] = [
  {
    path: '',
    component: ApartmentListComponent,
  },
  {
    path: ':id',
    component: ApartmentViewComponent,
  },
];

@NgModule({
  declarations: [
    ApartmentListComponent,
    ApartmentViewComponent,
    EditItemModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCFchCyZJ7047YRoMWVqHVQnX97KccaJHs'
    })
  ],
  providers: [
    ApartmentManagementService,
  ],
})
export class ApartmentManagementModule { }
