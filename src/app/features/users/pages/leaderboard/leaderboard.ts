import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { LeaderboardEntry } from '../../models/leaderboard.model';
import { Card } from '../../../../shared/ui/card/card';
import { Star } from '../../../../shared/ui/star/star';

@Component({
  selector: 'app-leaderboard',
  imports: [Card, Star],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard implements OnInit {
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);

  entries: LeaderboardEntry[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  private loadLeaderboard(): void {
    this.loading = true;
    this.usersService.getLeaderboard().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.entries = res.data.entries;
        }
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Error al cargar el ranking');
        this.loading = false;
      },
    });
  }

  getInitials(name: string, lastName: string): string {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
