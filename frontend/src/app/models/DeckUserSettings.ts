import { Deck } from './Deck';

export class DeckUserSettings {
  _id: string = '';
  userId: string = '';
  deckId: Deck = new Deck();
  algorithm: string = '';
  desiredRetention: number = -1;
  newCardsPerDay: number = -1;
}
