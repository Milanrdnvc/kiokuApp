import { Component, inject, OnInit } from '@angular/core';
import { CardContent } from '../models/CardContent';
import { DeckUserSettings } from '../models/DeckUserSettings';
import { CardService } from '../services/card.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-cards',
  imports: [FormsModule],
  templateUrl: './manage-cards.html',
  styleUrl: './manage-cards.css',
})
export class ManageCards implements OnInit {
  ngOnInit(): void {
    this.selectedDeck = JSON.parse(
      localStorage.getItem('selected-deck') || JSON.stringify(new DeckUserSettings()),
    );

    this.isOwner = !!this.selectedDeck.deckId.createdBy;

    this.getAllCards();
  }

  getAllCards() {
    this.cardService.getAllCards(this.selectedDeck.deckId._id).subscribe({
      next: (res) => {
        console.log('all cards: ', res);
        this.allCards = res as CardContent[];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private cardService = inject(CardService);

  selectedDeck: DeckUserSettings = new DeckUserSettings();
  isOwner: boolean = false;

  allCards: CardContent[] = [];

  newCardFront: string = '';
  newCardBack: string = '';

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

  validateInputNewCard(): boolean {
    if (!this.newCardFront || !this.newCardBack) {
      this.showError('Error! Front and back of the card are mandatory.');
      return false;
    }

    return true;
  }

  validateInputChangeCard(front: string, back: string) {
    if (!front || !back) {
      this.showError('Error! Front and back of the card are mandatory.');
      return false;
    }

    return true;
  }

  create() {
    if (!this.validateInputNewCard()) return;

    this.cardService
      .create(this.newCardFront, this.newCardBack, this.selectedDeck.deckId._id)
      .subscribe({
        next: (res) => {
          console.log(res);

          this.newCardFront = '';
          this.newCardBack = '';

          this.getAllCards();

          this.showSuccess('Successfully added.');
        },
        error: (err) => {
          console.log(err);
          this.showError(err.error.message);
        },
      });
  }

  change(newFront: string, newBack: string, _id: string) {
    if (!this.validateInputChangeCard(newFront, newBack)) return;

    this.cardService.change(newFront, newBack, _id).subscribe({
      next: (res) => {
        console.log(res);

        this.getAllCards();

        this.showSuccess('Successfully changed.');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  delete(_id: string) {
    this.cardService.delete(_id).subscribe({
      next: (res) => {
        console.log(res);

        this.getAllCards();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
