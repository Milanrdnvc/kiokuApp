import { Component, inject, OnInit } from '@angular/core';
import { CardUserData } from '../models/CardUserData';
import { CardContent } from '../models/CardContent';
import { CardService } from '../services/card.service';
import { DeckUserSettings } from '../models/DeckUserSettings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-study-deck',
  imports: [],
  templateUrl: './study-deck.html',
  styleUrl: './study-deck.css',
})
export class StudyDeck implements OnInit {
  ngOnInit(): void {
    this.selectedDeck = JSON.parse(
      localStorage.getItem('selected-deck') || JSON.stringify(new DeckUserSettings()),
    );

    this.cardService.getDueCards(this.selectedDeck.deckId._id).subscribe({
      next: (res) => {
        this.dueCards = res as CardUserData[];

        // init first card
        if (this.dueCards.length > 0) this.currentCard = this.dueCards[this.dueCardsIdx].cardId;

        this.cardService
          .getNewCards(this.selectedDeck.deckId._id, this.selectedDeck.newCardsPerDay)
          .subscribe({
            next: (res) => {
              this.newCards = res as CardContent[];

              // init first card
              if (this.newCards.length > 0 && this.dueCards.length == 0)
                this.currentCard = this.newCards[this.newCardsIdx];
            },
            error: (err) => {
              console.log(err);
            },
          });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private router = inject(Router);
  private cardService = inject(CardService);

  selectedDeck: DeckUserSettings = new DeckUserSettings();

  dueCards: CardUserData[] = [];
  newCards: CardContent[] = [];

  dueCardsIdx = 0;
  newCardsIdx = 0;
  currentCard: CardContent | null = null;

  isFlipped: boolean = false;

  errMsg: string = '';

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

  rate(grade: number) {
    if (!this.currentCard) return;

    const cardId = this.currentCard._id;

    if (this.dueCardsIdx < this.dueCards.length) {
      this.dueCardsIdx++;
    } else {
      this.newCardsIdx++;
    }

    if (this.dueCardsIdx < this.dueCards.length) {
      this.currentCard = this.dueCards[this.dueCardsIdx].cardId;
    } else if (this.newCardsIdx < this.newCards.length) {
      this.currentCard = this.newCards[this.newCardsIdx];
    } else {
      this.currentCard = null;
    }

    this.isFlipped = false;

    this.cardService.review(cardId, grade).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        this.showError(err.error.message);
      },
    });
  }

  showAnswer() {
    this.isFlipped = true;
  }

  backToDecks(): void {
    this.router.navigate(['/deck-list']);
  }
}
