import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { GeneralModal } from '../../../../shared/ui/modal/general-modal/general-modal';
import { UsersService } from '../../../users/services/users.service';
import { ResourcesService } from '../../../resources/services/resources.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { LoadSubtopicDetailResponse } from '../../../users/models/users-response.model';
import { Resource } from '../../../resources/models/resource.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { GetResourcesBySubtopicResponse } from '../../../resources/models/resources-response.model';

@Component({
  selector: 'app-subtopic-detail-modal',
  imports: [GeneralModal, SecondaryButton],
  templateUrl: './subtopic-detail-modal.html',
  styleUrl: './subtopic-detail-modal.css',
})
export class SubtopicDetailModal implements OnInit, OnChanges {
  private usersService = inject(UsersService);
  private resourcesService = inject(ResourcesService);
  private toastService = inject(ToastService);

  public competenceTitle = '';
  public competenceNumber = '';

  @Input({ required: true }) slug!: string;
  @Input({ required: true }) learningContextId!: number;
  @Input() subtopicSlugs: string[] = [];

  @Output() cancel = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();

  subtopicDetail = signal<LoadSubtopicDetailResponse | null>(null);
  loading = signal(true);

  resources: Resource[] = [];
  resourcePage = 1;
  resourcePageSize = 4;
  resourceTotalPages = 0;

  get currentIndex(): number {
    return this.subtopicSlugs.indexOf(this.slug);
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.subtopicSlugs.length - 1;
  }

  previous() {
    if (this.hasPrevious) {
      this.navigate.emit(this.subtopicSlugs[this.currentIndex - 1]);
    }
  }

  next() {
    if (this.hasNext) {
      this.navigate.emit(this.subtopicSlugs[this.currentIndex + 1]);
    }
  }

  ngOnInit() {
    this.loadSubtopicDetail();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['slug'] && !changes['slug'].isFirstChange()) {
      this.loading.set(true);
      this.resourcePage = 1;
      this.resources = [];
      this.loadSubtopicDetail();
    }
  }

  private loadSubtopicDetail() {
    this.usersService.loadSubtopicDetail(this.learningContextId, this.slug).subscribe({
      next: (res: ApiResponse<LoadSubtopicDetailResponse>) => {
        this.subtopicDetail.set(res.data ?? null);
        const competence = this.subtopicDetail()?.subTopicDetail?.items?.[0]?.competence;
        this.competenceTitle = competence?.name || '';
        this.competenceNumber = this.extractCompetenceNumber(competence?.code);
        this.loading.set(false);
        const subtopicId = res.data?.subTopicDetail?.items?.[0]?.subTopic?.id;
        if (subtopicId) {
          this.loadResources(subtopicId);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar el detalle del subtema.');
        this.loading.set(false);
      },
    });
  }

  private loadResources(subtopicId: number) {
    this.resourcesService.getResourcesBySubtopic(subtopicId, this.resourcePage, this.resourcePageSize).subscribe({
      next: (res: ApiResponse<GetResourcesBySubtopicResponse>) => {
        this.resources = res.data?.resources?.items ?? [];
        this.resourceTotalPages = res.data?.resources?.totalPages ?? 0;
      },
      error: () => {
        this.toastService.error('Error al cargar los recursos.');
      },
    });
  }

  previousPage() {
    if (this.resourcePage > 1) {
      this.resourcePage--;
      const subtopicId = this.subtopicDetail()?.subTopicDetail?.items?.[0]?.subTopic?.id;
      if (subtopicId) this.loadResources(subtopicId);
    }
  }

  private extractCompetenceNumber(code?: string): string {
    if (!code) return '';
    const match = code.match(/^C(\d+)/);
    return match ? match[1] : '';
  }

  nextPage() {
    if (this.resourcePage < this.resourceTotalPages) {
      this.resourcePage++;
      const subtopicId = this.subtopicDetail()?.subTopicDetail?.items?.[0]?.subTopic?.id;
      if (subtopicId) this.loadResources(subtopicId);
    }
  }
}
