import { Routes } from '@angular/router';
import { Guest } from './guest/guest';
import { Login } from './login/login';
import { Register } from './register/register';
import { DeckList } from './deck-list/deck-list';

export const routes: Routes = [
  { path: '', component: Guest },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'deck-list', component: DeckList },
];
