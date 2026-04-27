import { Component, inject } from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-home',
  imports: [
    Card,
    PrimaryButton
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);
  private appService = inject(AppService);
}
