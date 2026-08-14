import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { Message } from '../models/Message';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private userService = inject(UserService);

  usernameOrEmail: string = '';
  password: string = '';

  errMsg: string = '';

  validateInput(): boolean {
    if (!this.usernameOrEmail || !this.usernameOrEmail.trim()) {
      this.showError('Error! Please enter username or email.');
      return false;
    }

    if (!this.password) {
      this.showError('Error! Please enter password.');
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

  login() {
    if (!this.validateInput()) return;

    this.userService.login(this.usernameOrEmail, this.password).subscribe({
      next: (res) => {
        if (!(res instanceof Message)) {
          this.userService.setToken(res.token);
          this.router.navigate(['deck-list']);
        }
      },
      error: (err) => {
        console.log(err);
        this.showError(err.error.message);
      },
    });
  }
}
