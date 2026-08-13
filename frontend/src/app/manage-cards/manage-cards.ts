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

  create() {
    this.cardService
      .create(this.newCardFront, this.newCardBack, this.selectedDeck.deckId._id)
      .subscribe({
        next: (res) => {
          console.log(res);

          this.newCardFront = '';
          this.newCardBack = '';

          this.getAllCards();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  change(newFront: string, newBack: string, _id: string) {
    this.cardService.change(newFront, newBack, _id).subscribe({
      next: (res) => {
        console.log(res);

        this.getAllCards();
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
