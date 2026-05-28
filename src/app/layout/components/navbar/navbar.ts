import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Auth } from '../../../features/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PrimaryButton } from '../../../shared/ui/button/primary-button/primary-button';
import { Star } from '../../../shared/ui/star/star';


@Component({
  selector: 'app-navbar',
  imports: [
    AsyncPipe,
    RouterLink,
    CommonModule,
    PrimaryButton,
    Star
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private auth = inject(Auth);
  private elementRef = inject(ElementRef);

  user$ = this.auth.getUser();

  menuOpen = false;
  userMenuOpen = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.userMenuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  goHome() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/app/home']);
    } else {
      this.router.navigate(['/']);
    }
  }

  goLogin() {
    this.router.navigate(['/auth/login']);
  }

  goProfile() {
    this.userMenuOpen = false;
    this.router.navigate(['/app/me']);
  }

  goPreparation() {
    this.userMenuOpen = false;
    this.router.navigate(['/app/my-progress']);
  }

  logout() {
    this.userMenuOpen = false;
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
