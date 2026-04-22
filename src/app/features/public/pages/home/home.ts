import { Component, inject } from '@angular/core';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { Card } from '../../../../shared/ui/card/card';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    SecondaryButton,
    Card,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);


  public goLogin() {
    this.router.navigate(['/auth/login']);
  }

  public goRegister(){
    this.router.navigate(['/auth/register']);
  }
}
