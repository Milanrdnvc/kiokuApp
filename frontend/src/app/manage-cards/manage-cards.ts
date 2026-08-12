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
}
