import { Component, inject, OnInit } from '@angular/core';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Card } from '../../../../shared/ui/card/card';
import { ProgressBar } from '../../../../shared/ui/progress-bar/progress-bar';
import { LineChart } from '../../../../shared/ui/line-chart/line-chart';
import { Router } from '@angular/router';
import { UsersService } from '../../../users/services/users.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import {
  MainDashboardResponse,
  SyllabusProgressItem,
  UnitDetailsResponse,
} from '../../../users/models/dashboard.models';

@Component({
  selector: 'app-my-progress',
  imports: [PrimaryButton, Card, ProgressBar, LineChart],
  templateUrl: './my-progress.html',
  styleUrl: './my-progress.css',
})
export class MyProgress implements OnInit {
  private router = inject(Router);
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);

  public mainDashboard: MainDashboardResponse | null = null;
  public selectedSyllabus: SyllabusProgressItem | null = null;
  public unitDetails: UnitDetailsResponse | null = null;
  public chartLabels: string[] = [];
  public chartValues: number[] = [];
  public isLoadingDetails = false;

  ngOnInit() {
    this.loadDashboard();
  }

  private loadDashboard() {
    this.usersService.getMainDashboard().subscribe({
      next: (res: ApiResponse<MainDashboardResponse>) => {
        if (res.success && res.data) {
          this.mainDashboard = res.data;
          this.buildChartData();
        } else {
          this.toastService.error(res.message || 'Error al cargar el dashboard.');
        }
      },
      error: () => {
        this.toastService.error('Error al cargar el dashboard.');
      },
    });
  }

  private buildChartData() {
    if (!this.mainDashboard?.lastSimulations?.length) return;
    const sims = this.mainDashboard.lastSimulations.slice(-5);
    this.chartLabels = sims.map((s) => {
      const d = new Date(s.finishedAt);
      return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
    });
    this.chartValues = sims.map((s) =>
      Math.round((s.score / s.totalQuestions) * 100)
    );
  }

  public selectSyllabus(syllabus: SyllabusProgressItem) {
    if (this.selectedSyllabus?.syllabusSlug === syllabus.syllabusSlug) {
      this.selectedSyllabus = null;
      this.unitDetails = null;
      return;
    }
    this.selectedSyllabus = syllabus;
    this.isLoadingDetails = true;
    this.unitDetails = null;

    this.usersService
      .getUnitDetails(syllabus.userLearningContextId, syllabus.syllabusSlug)
      .subscribe({
        next: (res: ApiResponse<UnitDetailsResponse>) => {
          if (res.success && res.data) {
            this.unitDetails = res.data;
          } else {
            this.toastService.error(
              res.message || 'Error al cargar detalles del temario.'
            );
          }
          this.isLoadingDetails = false;
        },
        error: () => {
          this.toastService.error(
            'Error al cargar los detalles de las unidades.'
          );
          this.isLoadingDetails = false;
        },
      });
  }

  public goToMySyllabi() {
    this.router.navigate(['/app/my-syllabi']);
  }
}
