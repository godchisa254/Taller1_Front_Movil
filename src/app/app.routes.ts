import { Routes } from '@angular/router';
import { LoginComponent } from './user/page/login/login.component';
import { authGuard } from './user/guards/auth.guard';
import { ListComponent } from './product/page/list/list.component';
import { CartComponent } from './product/page/cart/cart.component';  
import { CuentaComponent } from './user/page/cuenta/cuenta.component';  
import { NotFoundComponent } from './shared/component/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: ListComponent,
      },
      {
        path: 'carrito',
        component: CartComponent, 
      },
      {
        path: 'cuenta',
        component: CuentaComponent, 
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
];
