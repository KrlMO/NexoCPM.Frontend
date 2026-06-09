import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Card } from '../../../../shared/ui/card/card';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Router, RouterLink } from '@angular/router';
import { AppService } from '../../services/app.service';
import { Auth } from '../../../auth/services/auth.service';
import { UsersService } from '../../../users/services/users.service';
import { HasCurrentSyllabusResponse, StartSyllabusResponse } from '../../../users/models/users-response.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { Line } from '../../../../shared/ui/line/line';
import { ProgressBar } from '../../../../shared/ui/progress-bar/progress-bar';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { GetDashboardResponse, GetFeaturedSyllabusResponse } from '../../models/app-responses.model';
import { SyllabusDashboard } from '../../../curriculum/models/dashboard-syllabus.model';
import { ConfirmModal } from '../../../../shared/ui/modal/confirm-modal/confirm-modal';

@Component({
  selector: 'app-home',
  imports: [
    Card,
    PrimaryButton,
    SecondaryButton,
    Line,
    ProgressBar,
    StarRating,
    RouterLink,
    ConfirmModal,
    DatePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private router = inject(Router);
  private auth = inject(Auth);
  private usersService = inject(UsersService);
  private appService = inject(AppService);
  private toastService = inject(ToastService);

  public userHasInfo = false;
  public userDashboard: GetDashboardResponse | null = null;
  public availableSyllabus: SyllabusDashboard[] = [];
  public isLoggedIn = false;

  public modalMode: 'none' | 'confirm' | 'alreadyStarted' = 'none';
  public pendingSyllabusName = '';
  public pendingSyllabusSlug = '';
  public existingContextId?: number;
  private isStarting = false;

  public lastModalityName: string = '';
  public lastLevelName: string = ''
  public lastSpecialityName: string = '';

  ngOnInit() {
    this.appService.getUserDashboard().subscribe({
      next: (res: ApiResponse<GetDashboardResponse>) => {
        if (res.success && res.data) {
          this.userDashboard = res.data;
          this.userHasInfo = res.data.userHasInfo;
          this.isLoggedIn = true;
          this.setLastSyllabusNames(res.data.lastSyllabus);

          if (!this.userHasInfo) {
            this.getFeaturedSyllabus();
          }
        } else {
          this.toastService.error('Un error al cargar el dashboard.');
          this.isLoggedIn = false;
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Error fetching user dashboard:', err);
        this.isLoggedIn = false;
        this.router.navigate(['/']);
        this.toastService.error(err.error?.message || 'Un error ocurrió al momento de cargar el dashboard del usuario.');
      }
    });
  }

  public getFeaturedSyllabus() {
    this.appService.getFeaturedSyllabus().subscribe({
      next: (res: ApiResponse<GetFeaturedSyllabusResponse>) => {
        debugger
        if (res.success && res.data) {
          this.availableSyllabus = res.data.featuredSyllabus;
        }
      },
      error: (err) => {
        console.error('Error fetching featured syllabus:', err);
        this.toastService.error(err.error?.message || 'Un error ocurrió al momento de cargar los temarios destacados.');
      }
    });
  }

  public goToSyllabi() {
    this.router.navigate(['/app/syllabi']);
  }

  private setLastSyllabusNames(lastSyllabus: SyllabusDashboard | null) {
    if (!lastSyllabus?.name) {
      this.lastModalityName = '';
      this.lastLevelName = '';
      this.lastSpecialityName = '';
      return;
    }

    const parts = lastSyllabus.name.split('-').map(part => part.trim());
    this.lastModalityName = parts[0] || '';
    this.lastLevelName = parts[1] || '';
    this.lastSpecialityName = parts[2] || '';
  }

  public startSyllabus(syllabus: SyllabusDashboard) {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.pendingSyllabusSlug = syllabus.slug;
    this.pendingSyllabusName = syllabus.name;

    this.usersService.hasCurrentSyllabus(syllabus.slug).subscribe({
      next: (res: ApiResponse<HasCurrentSyllabusResponse>) => {
        if (res.success && res.data?.hasCurrent) {
          debugger
          this.existingContextId = res.data.userLearningContextId;
          this.modalMode = 'alreadyStarted';
        } else {
          this.modalMode = 'confirm';
        }
      },
      error: () => {
        this.modalMode = 'confirm';
      }
    });

  }

  public continueSyllabus(syllabus: SyllabusDashboard) {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/app/my-syllabi', syllabus.userLearningContextId, syllabus.slug]);
    return;
  }

  public confirmStart() {
    if (this.isStarting) return;
    this.isStarting = true;
    this.modalMode = 'none';
    this.usersService.startSyllabus(this.pendingSyllabusSlug).subscribe({
      next: (res: ApiResponse<StartSyllabusResponse>) => {
        this.isStarting = false;
        if (res.success && res.data?.userSyllabus) {
          debugger
          const userSyllabus = res.data.userSyllabus;
          const learningContextId = res.data.userLearningContextId ?? userSyllabus.userLearningContextId;
          this.toastService.success(`Temario "${this.pendingSyllabusName}" iniciado correctamente.`);
          if (learningContextId) {
            this.router.navigate(['/app/my-syllabi', learningContextId, userSyllabus.slug]);
          }
        }
        this.pendingSyllabusSlug = '';
        this.pendingSyllabusName = '';
        this.existingContextId = undefined;

      },
      error: () => {
        this.isStarting = false;
        this.toastService.error('Error al iniciar el temario.');
        this.pendingSyllabusSlug = '';
        this.pendingSyllabusName = '';
        this.existingContextId = undefined;
      }
    });
  }

  public goToExistingSyllabus() {
    this.modalMode = 'none';
    this.toastService.info(`Redirigiendo al temario "${this.pendingSyllabusName}"...`);
    this.pendingSyllabusSlug = '';
    this.pendingSyllabusName = '';
    this.existingContextId = undefined;
  }

  public cancelStart() {
    this.modalMode = 'none';
    this.pendingSyllabusSlug = '';
    this.pendingSyllabusName = '';
    this.existingContextId = undefined;
  }

  public startFirstSimulation() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/app/evaluations/simulations']);
  }
}
