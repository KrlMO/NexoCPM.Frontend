import { Component } from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';

@Component({
  selector: 'app-preparation-dashboard',
  imports: [
    Card,
    PrimaryButton
  ],
  templateUrl: './preparation-dashboard.html',
  styleUrl: './preparation-dashboard.css',
})
export class PreparationDashboard {

}
