import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, } from '@angular/router';

import { UserService } from './services';
import { UserViewComponent } from './components/user-view/user-view.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';

const routes: Route[] = [
  {
    path: '',
    component: UserListComponent,
  },
  {
    path: ':id',
    component: UserViewComponent,
  },
];

@NgModule({
  declarations: [UserViewComponent, UserListComponent, EditUserModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [
    UserService,
  ],
})
export class UsersModule { }
