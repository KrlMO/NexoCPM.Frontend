import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../../shared/ui/card/card';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { Pagination } from '../../../../shared/ui/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { Modality } from '../../../context/models/modality.model';
import { Specialization } from '../../../context/models/specialization.model';
import { Level } from '../../../context/models/level.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Syllabus } from '../../models/syllabus.model';
import { CurriculumService } from '../../services/curriculum.service';
import { ContextService } from '../../../context/services/context.service';
import { GetContextFiltersResponse } from '../../../context/models/context-response.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { GetSyllabiResponse } from '../../models/curriculum-response.model';
import { PaginationParams } from '../../../../shared/models/pagination.model';
import { Auth } from '../../../../features/auth/services/auth.service';
import { UsersService } from '../../../../features/users/services/users.service';
import { HasCurrentSyllabusResponse, StartSyllabusResponse } from '../../../../features/users/models/users-response.model';
import { ConfirmModal } from '../../../../shared/ui/modal/confirm-modal/confirm-modal';

@Component({
  selector: 'app-syllabi',
  imports: [
    Card,
    SecondaryButton,
    Pagination,
    FormsModule,
    ConfirmModal,
  ],
  templateUrl: './syllabi.html',
  styleUrl: './syllabi.css',
})
export class Syllabi implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(Auth);
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);
  private curriculumService = inject(CurriculumService);
  private contextService = inject(ContextService);

  public modalities: Modality[] = [];
  public levels: Level[] = [];
  public specializations: Specialization[] = [];
  public syllabi: Syllabus[] = [];

  public pagination: PaginationParams = { page: 1, pageSize: 6 };
  public totalItems: number = 0;
  public totalPages: number = 0;
  public selectedModalitySlug: string = '';
  public selectedLevelSlug: string = '';
  public selectedSpecializationSlug: string = '';
  public searchTerm: string = '';

  public modalMode: 'none' | 'confirm' | 'alreadyStarted' = 'none';
  public pendingSyllabusName = '';
  public pendingSyllabusSlug = '';
  public existingContextId?: number;
  private isStarting = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.selectedModalitySlug = params['modality'] || '';
      this.selectedLevelSlug = params['level'] || '';
      this.selectedSpecializationSlug = params['specialization'] || '';

      const pageParam = params['page'];
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      const validPage = !isNaN(page) && page > 0 ? page : 1;

      this.pagination = { ...this.pagination, page: validPage };
      this.loadSyllabi(validPage);
    });
    this.loadFilters();
  }

  private loadFilters() {
    this.contextService.getContextFilters().subscribe({
      next: (res: ApiResponse<GetContextFiltersResponse>) => {
        this.modalities = res.data?.modalities || [];
        this.levels = res.data?.levels || [];
        this.specializations = res.data?.specializations || [];
      },
      error: (err) => {
        console.error('Error fetching context filters:', err);
        this.toastService.error('Un error ocurrió al cargar los filtros de contexto.');
      }
    });
  }

  public loadSyllabi(page: number = 1) {
    this.pagination = { ...this.pagination, page };
    this.curriculumService.getSyllabi(
      this.selectedModalitySlug || null,
      this.selectedLevelSlug || null,
      this.selectedSpecializationSlug || null,
      this.searchTerm || null,
      this.pagination
    ).subscribe({
      next: (res: ApiResponse<GetSyllabiResponse>) => {
        const result = res.data?.syllabi;
        this.syllabi = result?.items ?? [];
        this.totalItems = result?.totalCount ?? 0;
        this.totalPages = result?.totalPages ?? 0;
      },
      error: (err) => {
        console.error('Error fetching syllabi:', err);
        this.toastService.error('Un error ocurrió al cargar los sílabos.');
      }
    });
  }

  public get showSpecialization(): boolean {
    return this.selectedLevelSlug === 'ebr-secundaria';
  }

  public onFilterChange() {
    if (!this.showSpecialization) {
      this.selectedSpecializationSlug = '';
    }
    this.pagination = { ...this.pagination, page: 1 };
    this.syncFiltersToUrl();
  }

  public onSearch() {
    this.pagination = { ...this.pagination, page: 1 };
    this.syncFiltersToUrl();
  }

  public onPageChange(page: number) {
    this.pagination = { ...this.pagination, page };
    this.syncFiltersToUrl();
  }

  private syncFiltersToUrl() {
    const queryParams: Record<string, string | number | undefined> = {};
    if (this.searchTerm) queryParams['search'] = this.searchTerm;
    if (this.selectedModalitySlug) queryParams['modality'] = this.selectedModalitySlug;
    if (this.selectedLevelSlug) queryParams['level'] = this.selectedLevelSlug;
    if (this.selectedSpecializationSlug) queryParams['specialization'] = this.selectedSpecializationSlug;
    if (this.pagination.page > 1) queryParams['page'] = this.pagination.page;

    this.router.navigate([], {
      queryParams,
      replaceUrl: true,
    });
  }

  public startSyllabus(syllabus: Syllabus) {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.pendingSyllabusSlug = syllabus.slug;
    this.pendingSyllabusName = syllabus.name;

    this.usersService.hasCurrentSyllabus(syllabus.slug).subscribe({
      next: (res: ApiResponse<HasCurrentSyllabusResponse>) => {
        if (res.success && res.data?.hasCurrent) {
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

  public confirmStart() {
    if (this.isStarting) return;
    this.isStarting = true;
    this.modalMode = 'none';
    this.usersService.startSyllabus(this.pendingSyllabusSlug).subscribe({
      next: (res: ApiResponse<StartSyllabusResponse>) => {
        this.isStarting = false;
        if (res.success && res.data?.userSyllabus) {
          const userSyllabus = res.data.userSyllabus;
          const learningContextId = res.data.userLearningContextId ?? userSyllabus.userLearningContextId;
          if (learningContextId) {
            this.toastService.success(`Temario "${this.pendingSyllabusName}" iniciado correctamente.`);
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
    this.router.navigate(['/app/my-syllabi', this.existingContextId, this.pendingSyllabusSlug]);
    this.modalMode = 'none';
    this.pendingSyllabusSlug = '';
    this.pendingSyllabusName = '';
    this.existingContextId = undefined;
  }

  public goToMySyllabi() {
    this.router.navigate(['/app/my-syllabi']);
  }

  public cancelStart() {
    this.modalMode = 'none';
    this.pendingSyllabusSlug = '';
    this.pendingSyllabusName = '';
    this.existingContextId = undefined;
  }
}