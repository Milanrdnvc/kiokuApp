import { CardContent } from './CardContent';

export class CardUserData {
  _id: string = '';
  userId: string = '';
  cardId: CardContent = new CardContent();
  interval: number = -1;
  nextReview: Date = new Date();
  lastReview: Date = new Date();
  reps: number = -1;
  lapses: number = -1;
  easeFactor: number = -1;
  repetitions: number = -1;
  stability: number = -1;
  difficulty: number = -1;
}
