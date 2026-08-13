import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DeckUserSettings } from '../models/DeckUserSettings';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/deck';

  getAll() {
    return this.http.get<DeckUserSettings[] | Message>(`${this.uri}/getAll`);
  }

  update(
    id: string,
    name: string,
    desiredRetention: number,
    newCardsPerDay: number,
    algorithm: string,
  ) {
    const data = {
      id,
      name,
      desiredRetention,
      newCardsPerDay,
      algorithm,
    };

    return this.http.post<Message>(`${this.uri}/update`, data);
  }

  create(name: string) {
    const data = { name };

    return this.http.post<Message>(`${this.uri}/create`, data);
  }
}
