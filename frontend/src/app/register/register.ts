import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/User';

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
      next: (data) => {
        console.log(data);
      },
      error: (err) => {},
    });
  }
}
