import { Component, inject, OnInit } from '@angular/core';
import { Stats } from '../models/Stats';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-statistics',
  imports: [],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics implements OnInit {
  private statsService = inject(StatsService);

  stats: Stats | null = null;
  errMsg: string = '';

  ngOnInit(): void {
    this.statsService.getUserStatistics().subscribe({
      next: (res) => {
        console.log(res);
        this.stats = res;
      },
      error: (err) => {
        this.errMsg = err.error.message;
      },
    });
  }

  getGradeKeys(): number[] {
    if (!this.stats?.gradeBreakdown) return [];
    return Object.keys(this.stats.gradeBreakdown)
      .map(Number)
      .sort((a, b) => a - b);
  }

  getGradeLabel(grade: number): string {
    const labels: Record<number, string> = {
      0: 'Blackout',
      1: 'Again',
      2: 'Hard',
      3: 'Good',
      4: 'Easy',
      5: 'Perfect',
    };

    return labels[grade] ?? `Grade ${grade}`;
  }
}
