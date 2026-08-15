import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Stats } from '../models/Stats';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/stats';

  getUserStatistics() {
    return this.http.get<Stats>(`${this.uri}/getUserStatistics`);
  }
}
