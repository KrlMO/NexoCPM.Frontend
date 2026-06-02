import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../../../../shared/ui/card/card';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { GetPublicProfileResponse } from '../../models/profile.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Star } from '../../../../shared/ui/star/star';

@Component({
  selector: 'app-public-profile',
  imports: [Card, Star],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css',
})
export class PublicProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private toast = inject(ToastService);

  loading = true;
  notFound = false;
  isPrivate = false;
  profile: GetPublicProfileResponse | null = null;

  get linkedInUrl(): string | null {
    if (!this.profile?.linkedInProfile) return null;
    const url = this.profile.linkedInProfile;
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  }

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (!code) {
      this.notFound = true;
      this.loading = false;
      return;
    }
    this.loadProfile(code);
  }

  private loadProfile(code: string): void {
    this.loading = true;
    this.usersService.getPublicProfile(code).subscribe({
      next: (res: ApiResponse<GetPublicProfileResponse>) => {
        if (res.data) {
          this.notFound = res.data.notFound;
          this.isPrivate = res.data.isPrivate;
          this.profile = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
        this.toast.error('Error al cargar el perfil público');
      },
    });
  }
}
