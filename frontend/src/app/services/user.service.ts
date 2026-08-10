import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/user';

  register(u: User) {
    return this.http.post<Message | { message: string; token: string; user: User }>(
      `${this.uri}/register`,
      u,
    );
  }

  login(usernameOrEmail: string, password: string) {
    const data = {
      usernameOrEmail,
      password,
    };

    return this.http.post<Message | { message: string; token: string; user: User }>(
      `${this.uri}/login`,
      data,
    );
  }
}
