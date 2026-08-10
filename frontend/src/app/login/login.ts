import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { Message } from '../models/Message';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private userService = inject(UserService);

  usernameOrEmail: string = '';
  password: string = '';

  login() {
    this.userService.login(this.usernameOrEmail, this.password).subscribe({
      next: (res) => {
        if (!(res instanceof Message)) this.userService.setToken(res.token);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
