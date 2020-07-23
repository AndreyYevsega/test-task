import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from 'src/app/core/auth/components/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/core/auth/components/sign-up/sign-up.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { NoAuthGuard } from './core/auth/guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    // canActivate: [NoAuthGuard],
    children: [
      {
        path: '',
        component: SignInComponent,
        // canActivate: [NoAuthGuard]
      },
      {
        path: 'login',
        component: SignInComponent,
        // canActivate: [NoAuthGuard]
      },
      {
        path: 'register',
        component: SignUpComponent,
        // canActivate: [NoAuthGuard]
      },
      // {
      //   path: 'logout',
      //   component: SignUpComponent,
      // },
    ]
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // enableTracing: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
