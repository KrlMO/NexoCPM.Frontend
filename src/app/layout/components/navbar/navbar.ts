import { Component, inject } from '@angular/core';
import { Auth } from '../../../features/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PrimaryButton } from '../../../shared/ui/button/primary-button/primary-button';


@Component({
  selector: 'app-navbar',
  imports: [
    AsyncPipe,
    RouterLink,
    CommonModule,
    PrimaryButton
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private auth = inject(Auth);

  user$ = this.auth.getUser();

  menuOpen = false;
  userMenuOpen = false;

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
    this.router.navigate(['/app/profile']);
  }

  goPreparation() {
    this.router.navigate(['/app/my-progress']);
  }

  logout() {
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
