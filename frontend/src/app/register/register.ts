import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { Message } from '../models/Message';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private userService = inject(UserService);

  newUser: User = new User();

  register() {
    this.userService.register(this.newUser).subscribe({
      next: (res) => {
        if (!(res instanceof Message)) this.userService.setToken(res.token);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
