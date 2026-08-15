import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  private router = inject(Router);
  private userService = inject(UserService);

  newUser: User = new User();

  errMsg: string = '';

  validateInput(): boolean {
    if (!this.newUser.username || this.newUser.username.trim().length < 3) {
      this.showError('Error! Username must have at least 3 characters.');
      return false;
    }

    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.newUser.email)) {
      this.showError('Error! Invalid email.');
      return false;
    }

    if (
      !/^[A-Za-z][A-Za-z0-9!@#$%^&*]{7,11}$/.test(this.newUser.password) ||
      (this.newUser.password.match(/[A-Z]/g) || []).length < 1 ||
      (this.newUser.password.match(/[0-9]/g) || []).length < 1 ||
      (this.newUser.password.match(/[!@#$%^&*]/g) || []).length < 1
    ) {
      this.showError(
        'Error! Password must have 8-12 characters, at least one uppercase letter, one number and one special character and must start with a letter.',
      );
      return false;
    }

    return true;
  }

  private errorTimeoutId: any = null;
  private showError(msg: string): void {
    this.errMsg = msg;

    if (this.errorTimeoutId) {
      clearTimeout(this.errorTimeoutId);
    }

    this.errorTimeoutId = setTimeout(() => {
      this.errMsg = '';
      this.errorTimeoutId = null;
    }, 5000);
  }

  register() {
    if (!this.validateInput()) return;

    this.userService.register(this.newUser).subscribe({
      next: (res) => {
        if (!(res instanceof Message)) this.userService.setToken(res.token);

        this.router.navigate(['login']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
