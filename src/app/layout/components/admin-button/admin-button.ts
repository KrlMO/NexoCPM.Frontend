import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Auth } from '../../../features/auth/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-button',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './admin-button.html',
  styleUrl: './admin-button.css',
})
export class AdminButton {
  private auth = inject(Auth);
  private elementRef = inject(ElementRef);

  user$ = this.auth.getUser();
  menuOpen = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
