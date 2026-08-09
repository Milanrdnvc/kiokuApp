import { Routes } from '@angular/router';
import { Guest } from './guest/guest';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
  { path: '', component: Guest },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
];
