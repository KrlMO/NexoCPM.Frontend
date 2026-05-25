import { Component, inject } from '@angular/core';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Card } from '../../../../shared/ui/card/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-progress',
  imports: [
    PrimaryButton,
    Card
  ],
  templateUrl: './my-progress.html',
  styleUrl: './my-progress.css',
})
export class MyProgress {
  public router = inject(Router);

  public goToMySyllabi(){
    this.router.navigate(['/app/my-syllabi']);
  }
}
