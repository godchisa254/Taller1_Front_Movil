import { Routes } from '@angular/router';
import { LoginComponent } from './user/page/login/login.component';
import { authGuard } from './user/guards/auth.guard';
import { ListComponent } from './product/page/list/list.component';
import { NotFoundComponent } from './shared/component/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'products',
    canActivate: [authGuard],
    children: [
      {
        path: 'list',
        component: ListComponent,
      },
    ],
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
];
