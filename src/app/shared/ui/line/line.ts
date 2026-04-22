import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-line',
  imports: [],
  templateUrl: './line.html',
  styleUrl: './line.css',
})
export class Line {
  @Input() lineColor: string = '#2597C8';
}
