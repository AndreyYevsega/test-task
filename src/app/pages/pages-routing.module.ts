import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AuthGuard } from '../core/auth/auth.guard';
import { PageNotFoundComponent } from 'src/app/shared/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'apartments',
        pathMatch: 'full',
        // canActivate: [AuthGuard],
        // data: {
        // 	expectedRole: [
        // 		RolesEnum.ADMIN
        // 	]
        // }
      },
      {
        path: 'apartments',
        loadChildren: () =>
          import('./apartment-management/apartment-management.module').then((m) => m.ApartmentManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
