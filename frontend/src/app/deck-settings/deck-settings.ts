import { Component, inject, OnInit } from '@angular/core';
import { DeckUserSettings } from '../models/DeckUserSettings';
import { FormsModule } from '@angular/forms';
import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-deck-settings',
  imports: [FormsModule],
  templateUrl: './deck-settings.html',
  styleUrl: './deck-settings.css',
})
export class DeckSettings implements OnInit {
  ngOnInit(): void {
    this.selectedDeck = JSON.parse(
      localStorage.getItem('selected-deck') || JSON.stringify(new DeckUserSettings()),
    );

    this.isOwner = !!this.selectedDeck.deckId.createdBy;

    this.newDeckName = this.selectedDeck.deckId.name;
    this.newCardsPerDay = this.selectedDeck.newCardsPerDay;
    this.newDesiredRetention = this.selectedDeck.desiredRetention;
    this.newAlgorithm = this.selectedDeck.algorithm;
  }

  private deckService = inject(DeckService);

  selectedDeck: DeckUserSettings = new DeckUserSettings();

  isOwner: boolean = false;

  newDeckName: string = '';
  newCardsPerDay: number = -1;
  newDesiredRetention: number = -1;
  newAlgorithm: string = '';

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
    if (this.isOwner && (!this.newDeckName || !this.newDeckName.trim())) {
      this.showError('Error! Deck name cannot be empty.');
      return false;
    }

    if (this.newCardsPerDay == null || this.newCardsPerDay < 0) {
      this.showError('Error! New cards per day must be 0 or greater.');
      return false;
    }

    if (
      this.newDesiredRetention == null ||
      this.newDesiredRetention < 0.7 ||
      this.newDesiredRetention > 0.99
    ) {
      this.showError('Error! Desired retention must be between 0.70 and 0.99.');
      return false;
    }

    return true;
  }

  update() {
    if (!this.validateInput()) return;

    this.deckService
      .update(
        this.selectedDeck.deckId._id,
        this.newDeckName,
        this.newDesiredRetention,
        this.newCardsPerDay,
        this.newAlgorithm,
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.showSuccess('Settings saved successfully.');

          this.selectedDeck.deckId.name = this.newDeckName;
          this.selectedDeck.desiredRetention = this.newDesiredRetention;
          this.selectedDeck.newCardsPerDay = this.newCardsPerDay;
          this.selectedDeck.algorithm = this.newAlgorithm;

          localStorage.setItem('selected-deck', JSON.stringify(this.selectedDeck));
        },
        error: (err) => {
          console.log(err);
          this.showError(err.error.message);
        },
      });
  }
}
