import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getHomeLink(): string {
    return this.isLoggedIn() ? '/deck-list' : '';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('selected-deck');
    this.router.navigate(['/login']);
  }
}
