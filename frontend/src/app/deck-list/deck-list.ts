import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeckService } from '../services/deck.service';
import { DeckUserSettings } from '../models/DeckUserSettings';

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

  private deckService = inject(DeckService);

  deckList: DeckUserSettings[] = [];
}
