import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../../../../shared/ui/card/card';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Pagination } from '../../../../shared/ui/pagination/pagination';
import { ProgressBar } from '../../../../shared/ui/progress-bar/progress-bar';
import { UsersService } from '../../../users/services/users.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { UserSyllabus } from '../../../users/models/user-syllabus.model';
import { PaginationParams } from '../../../../shared/models/pagination.model';
import { GetMySyllabiResponse } from '../../../users/models/users-response.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-my-syllabi',
  imports: [
    Card,
    SecondaryButton,
    PrimaryButton,
    Pagination,
    ProgressBar,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './my-syllabi.html',
  styleUrl: './my-syllabi.css',
})
export class MySyllabi implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);

  public mySyllabi: UserSyllabus[] = [];
  public pagination: PaginationParams = { page: 1, pageSize: 6 };
  public totalItems = 0;
  public totalPages = 0;
  public searchTerm = '';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public isLoading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.sortOrder = params['sort'] === 'asc' ? 'asc' : 'desc';

      const pageParam = params['page'];
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      const validPage = !isNaN(page) && page > 0 ? page : 1;

      this.pagination = { ...this.pagination, page: validPage };
      this.loadMySyllabi();
    });
  }

  loadMySyllabi() {
    this.isLoading = true;
    this.usersService.getMySyllabi(
      this.searchTerm || null,
      this.sortOrder,
      this.pagination
    ).subscribe({
      next: (res: ApiResponse<GetMySyllabiResponse>) => {
        debugger
        this.isLoading = false;
        const result = res.data?.mySyllabi;
        this.mySyllabi = result?.items ?? [];
        this.totalItems = result?.totalCount ?? 0;
        this.totalPages = result?.totalPages ?? 0;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar tus temarios.');
      }
    });
  }

  onSearch() {
    this.pagination = { ...this.pagination, page: 1 };
    this.syncFiltersToUrl();
  }

  onSortChange() {
    this.pagination = { ...this.pagination, page: 1 };
    this.syncFiltersToUrl();
  }

  onPageChange(page: number) {
    this.pagination = { ...this.pagination, page };
    this.syncFiltersToUrl();
  }

  private syncFiltersToUrl() {
    const queryParams: Record<string, string | number | undefined> = {};
    if (this.searchTerm) queryParams['search'] = this.searchTerm;
    if (this.sortOrder !== 'desc') queryParams['sort'] = this.sortOrder;
    if (this.pagination.page > 1) queryParams['page'] = this.pagination.page;

    this.router.navigate([], {
      queryParams,
      replaceUrl: true,
    });
  }

  continueSyllabus(syllabus: UserSyllabus) {
    this.toastService.info(`Continuar con "${syllabus.name}" (próximamente).`);
  }

  goToSyllabi() {
    this.router.navigate(['/app/syllabi']);
  }
}
