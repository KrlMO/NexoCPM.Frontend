import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating {
  rating = input.required<number>();
  max = input<number>(5);

  stars = computed(() => {
    const rating = this.rating();
    const max = this.max();
    return Array.from({ length: max }, (_, i) => i < rating);
  });
}
