import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';

@Component({
  selector: 'app-not-found',
  imports: [SecondaryButton, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private router = inject(Router);

  public goHome() {
    this.router.navigate(['/']);
  }
}