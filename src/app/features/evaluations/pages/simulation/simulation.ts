import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../../shared/ui/card/card';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Pagination } from '../../../../shared/ui/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { GetSimulationsResponse, GetSimulationsHistoryResponse } from '../../models/evaluations-response.model';
import { PaginationParams } from '../../../../shared/models/pagination.model';
import { EvaluationsService } from '../../services/evaluations.service';
import { Simulation as SimulationModel, SimulationHistoryItem } from '../../models/simulation.model';
import { Auth } from '../../../auth/services/auth.service';
import { Star } from '../../../../shared/ui/star/star';

@Component({
  selector: 'app-simulation',
  imports: [
    Card,
    PrimaryButton,
    Pagination,
    FormsModule,
    Star,
  ],
  templateUrl: './simulation.html',
  styleUrl: './simulation.css',
})
export class Simulation implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private evaluationsService = inject(EvaluationsService);
  private auth = inject(Auth);

  public simulations: SimulationModel[] = [];

  public pagination: PaginationParams = { page: 1, pageSize: 10 };
  public totalItems: number = 0;
  public totalPages: number = 0;
  public searchTerm: string = '';
  public isLoading: boolean = false;

  public history: SimulationHistoryItem[] = [];
  public historyPagination: PaginationParams = { page: 1, pageSize: 5 };
  public historyTotalItems: number = 0;
  public historyTotalPages: number = 0;
  public isLoadingHistory: boolean = false;
  public isAuthenticated: boolean = false;

  ngOnInit() {
    this.isAuthenticated = this.auth.isAuthenticated();

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';

      const pageParam = params['page'];
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      const validPage = !isNaN(page) && page > 0 ? page : 1;

      this.pagination = { ...this.pagination, page: validPage };
      this.loadSimulations(validPage);
    });

    this.loadHistory();
  }

  public loadSimulations(page: number = 1) {
    this.isLoading = true;
    this.pagination = { ...this.pagination, page };
    this.evaluationsService.getSimulations(
      this.searchTerm || null,
      this.pagination
    ).subscribe({
      next: (res: ApiResponse<GetSimulationsResponse>) => {
        const result = res.data?.simulations;
        this.simulations = result?.items ?? [];
        this.totalItems = result?.totalCount ?? 0;
        this.totalPages = result?.totalPages ?? 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar los simulacros.');
      }
    });
  }

  public loadHistory(page: number = 1) {
    if (!this.isAuthenticated) return;

    this.isLoadingHistory = true;
    this.historyPagination = { ...this.historyPagination, page };
    this.evaluationsService.getSimulationHistory(this.historyPagination).subscribe({
      next: (res: ApiResponse<GetSimulationsHistoryResponse>) => {
        const result = res.data?.history;
        this.history = result?.items ?? [];
        this.historyTotalItems = result?.totalCount ?? 0;
        this.historyTotalPages = result?.totalPages ?? 0;
        this.isLoadingHistory = false;
      },
      error: () => {
        this.isLoadingHistory = false;
      }
    });
  }

  public onHistoryPageChange(page: number) {
    this.loadHistory(page);
  }

  public onSearch() {
    this.pagination = { ...this.pagination, page: 1 };
    this.syncFiltersToUrl();
  }

  public goLogin() {
    this.router.navigate(['/auth/login']);
  }

  public onStartSimulation(sim: SimulationModel) {
    this.toastService.info('Funcionalidad próximamente disponible.');
  }

  public onPageChange(page: number) {
    this.pagination = { ...this.pagination, page };
    this.syncFiltersToUrl();
  }

  public range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  public formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  public getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  private syncFiltersToUrl() {
    const queryParams: Record<string, string | number | undefined> = {};
    if (this.searchTerm) queryParams['search'] = this.searchTerm;
    if (this.pagination.page > 1) queryParams['page'] = this.pagination.page;

    this.router.navigate([], {
      queryParams,
      replaceUrl: true,
    });
  }
}
