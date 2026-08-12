import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeckService } from '../services/deck.service';
import { DeckUserSettings } from '../models/DeckUserSettings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deck-list',
  imports: [FormsModule],
  templateUrl: './deck-list.html',
  styleUrl: './deck-list.css',
})
export class DeckList implements OnInit {
  ngOnInit(): void {
    this.deckService.getAll().subscribe({
      next: (res) => {
        this.deckList = res as DeckUserSettings[];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private router = inject(Router);
  private deckService = inject(DeckService);

  deckList: DeckUserSettings[] = [];

  studyDeck(deck: DeckUserSettings) {
    localStorage.setItem('selected-deck', JSON.stringify(deck));

    this.router.navigate(['study-deck']);
  }

  manageCards(deck: DeckUserSettings) {
    localStorage.setItem('selected-deck', JSON.stringify(deck));

    this.router.navigate(['manage-cards']);
  }
}
