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

  createDeck() {
    this.deckService.create(this.newDeckName).subscribe({
      next: (res) => {
        console.log(res);
        this.newDeckName = '';
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
