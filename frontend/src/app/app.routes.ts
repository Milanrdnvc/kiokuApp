import { Routes } from '@angular/router';
import { Guest } from './guest/guest';
import { Login } from './login/login';
import { Register } from './register/register';
import { DeckList } from './deck-list/deck-list';
import { StudyDeck } from './study-deck/study-deck';
import { ManageCards } from './manage-cards/manage-cards';
import { DeckSettings } from './deck-settings/deck-settings';
import { CreateDeck } from './create-deck/create-deck';
import { authGuard } from './helpers/auth.guard';
import { Statistics } from './statistics/statistics';

export const routes: Routes = [
  { path: '', component: Guest },
  { path: 'register', component: Register },
  { path: 'login', component: Login },

  { path: 'deck-list', component: DeckList, canActivate: [authGuard] },
  { path: 'study-deck', component: StudyDeck, canActivate: [authGuard] },
  { path: 'manage-cards', component: ManageCards, canActivate: [authGuard] },
  { path: 'deck-settings', component: DeckSettings, canActivate: [authGuard] },
  { path: 'create-deck', component: CreateDeck, canActivate: [authGuard] },
  { path: 'statistics', component: Statistics, canActivate: [authGuard] },

  { path: '**', redirectTo: '' },
];
