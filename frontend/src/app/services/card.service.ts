import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CardUserData } from '../models/CardUserData';
import { Message } from '../models/Message';
import { CardContent } from '../models/CardContent';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/card';

  getDueCards(deckId: string) {
    const data = {
      deckId,
    };

    return this.http.post<CardUserData[] | Message>(`${this.uri}/getDueCards`, data);
  }

  getNewCards(deckId: string, limit: number) {
    const data = {
      deckId,
      limit,
    };

    return this.http.post<CardContent[] | Message>(`${this.uri}/getNewCards`, data);
  }

  review(cardId: string, grade: number) {
    const data = {
      cardId,
      grade,
    };

    return this.http.post<Message>(`${this.uri}/review`, data);
  }
}
