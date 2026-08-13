import { Routes } from '@angular/router';
import { Guest } from './guest/guest';
import { Login } from './login/login';
import { Register } from './register/register';
import { DeckList } from './deck-list/deck-list';
import { StudyDeck } from './study-deck/study-deck';
import { ManageCards } from './manage-cards/manage-cards';
import { DeckSettings } from './deck-settings/deck-settings';
import { CreateDeck } from './create-deck/create-deck';

export const routes: Routes = [
  { path: '', component: Guest },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'deck-list', component: DeckList },
  { path: 'study-deck', component: StudyDeck },
  { path: 'manage-cards', component: ManageCards },
  { path: 'deck-settings', component: DeckSettings },
  { path: 'create-deck', component: CreateDeck },
];
