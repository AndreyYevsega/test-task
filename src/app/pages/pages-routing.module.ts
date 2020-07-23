import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard, AdminGuard } from '../core/auth/guards';
import { PagesComponent } from './pages.component';
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
      },
      {
        path: 'apartments',
        loadChildren: () =>
          import('./apartment-management/apartment-management.module').then((m) => m.ApartmentManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [AuthGuard, AdminGuard]
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
