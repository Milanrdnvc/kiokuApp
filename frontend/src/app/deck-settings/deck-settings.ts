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

  update() {
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
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
