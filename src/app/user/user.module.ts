import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';
import { UserListModule } from './user-list/user-list.module';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'create',
        loadChildren: './user-create/user-create.module#UserCreateModule',
      },
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, UserListModule, RouterModule.forChild(routes)],
  declarations: [UserComponent],
})
export class UserModule {}
