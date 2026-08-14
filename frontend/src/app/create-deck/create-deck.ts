import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-create-deck',
  imports: [FormsModule],
  templateUrl: './create-deck.html',
  styleUrl: './create-deck.css',
})
export class CreateDeck {
  private deckService = inject(DeckService);

  newDeckName: string = '';

  errMsg: string = '';
  succMsg: string = '';

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

  private successTimeoutId: any = null;
  private showSuccess(msg: string): void {
    this.succMsg = msg;

    if (this.succMsg) {
      clearTimeout(this.successTimeoutId);
    }

    this.successTimeoutId = setTimeout(() => {
      this.succMsg = '';
      this.successTimeoutId = null;
    }, 3000);
  }

  validateInput(): boolean {
    if (!this.newDeckName || !this.newDeckName.trim()) {
      this.showError('Error! Deck name cannot be empty.');
      return false;
    }

    return true;
  }

  createDeck() {
    if (!this.validateInput()) return;

    this.deckService.create(this.newDeckName).subscribe({
      next: (res) => {
        console.log(res);
        this.newDeckName = '';
        this.showSuccess('Deck created successfully.');
      },
      error: (err) => {
        console.log(err);
        this.showError(err.error.message);
      },
    });
  }
}
