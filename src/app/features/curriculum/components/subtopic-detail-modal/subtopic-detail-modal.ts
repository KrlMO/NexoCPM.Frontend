import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GeneralModal } from '../../../../shared/ui/modal/general-modal/general-modal';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { UsersService } from '../../../users/services/users.service';
import { ResourcesService } from '../../../resources/services/resources.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { LoadSubtopicDetailResponse } from '../../../users/models/users-response.model';
import { Resource } from '../../../resources/models/resource.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { CreateResourceRequest, GetResourcesBySubtopicResponse, ResourceContentType } from '../../../resources/models/resources-response.model';

@Component({
  selector: 'app-subtopic-detail-modal',
  imports: [GeneralModal, SecondaryButton, PrimaryButton, FormsModule, DatePipe],
  templateUrl: './subtopic-detail-modal.html',
  styleUrl: './subtopic-detail-modal.css',
})
export class SubtopicDetailModal implements OnInit, OnChanges {
  private router = inject(Router);
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
  toggling = signal(false);

  resources: Resource[] = [];
  resourcePage = 1;
  resourcePageSize = 4;
  resourceTotalPages = 0;
  likedResourceIds = new Set<number>();
  likeInFlight = new Set<number>();
  viewingResourceIds = new Set<number>();

  showResourceForm = false;
  resourceForm: CreateResourceRequest = {
    title: '',
    url: '',
    description: '',
    subTopicId: 0,
    author: '',
    sourceName: '',
    publishedAt: '',
    type: ResourceContentType.Otros,
  };
  resourceTypes = Object.entries(ResourceContentType)
    .filter(([key]) => isNaN(Number(key)))
    .map(([label, value]) => ({ label, value: value as number }));
  isCreatingResource = false;

  getResourceTypeLabel(type: number): string {
    return ResourceContentType[type] ?? 'Otros';
  }

  get completed(): boolean {
    return this.subtopicDetail()?.subTopicDetail?.items?.[0]?.isCompleted ?? false;
  }

  toggleCompletion(): void {
    const detail = this.subtopicDetail()?.subTopicDetail?.items?.[0];
    if (!detail?.subTopic?.id) return;

    this.toggling.set(true);
    this.usersService.toggleSubtopicCompletion(this.learningContextId, detail.subTopic.id).subscribe({
      next: (res) => {
        const detail = this.subtopicDetail();
        if (detail?.subTopicDetail?.items?.[0]) {
          detail.subTopicDetail.items[0].isCompleted = res.data?.isCompleted ?? !this.completed;
        }
        this.toggling.set(false);
      },
      error: () => {
        this.toastService.error('Error al actualizar el estado');
        this.toggling.set(false);
      },
    });
  }

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
        const items = res.data?.resources?.items ?? [];
        this.resources = items;
        this.resourceTotalPages = res.data?.resources?.totalPages ?? 0;
        this.likedResourceIds = new Set(items.filter(r => r.isLiked).map(r => r.id));
      },
      error: () => {
        this.toastService.error('Error al cargar los recursos.');
      },
    });
  }

  toggleLike(resource: Resource) {
    if (this.likeInFlight.has(resource.id)) return;
    this.likeInFlight.add(resource.id);
    const wasLiked = this.likedResourceIds.has(resource.id);
    if (wasLiked) {
      this.likedResourceIds.delete(resource.id);
      resource.likesCount--;
    } else {
      this.likedResourceIds.add(resource.id);
      resource.likesCount++;
    }
    this.resourcesService.likeResource(resource.id).subscribe({
      next: (res) => {
        this.likeInFlight.delete(resource.id);
        if (res.success && res.data) {
          resource.likesCount = res.data.likesCount;
          if (res.data.liked) this.likedResourceIds.add(resource.id);
          else this.likedResourceIds.delete(resource.id);
        }
      },
      error: () => {
        this.likeInFlight.delete(resource.id);
        if (wasLiked) {
          this.likedResourceIds.add(resource.id);
          resource.likesCount++;
        } else {
          this.likedResourceIds.delete(resource.id);
          resource.likesCount--;
        }
      },
    });
  }

  trackView(resource: Resource) {
    if (this.viewingResourceIds.has(resource.id)) return;
    this.viewingResourceIds.add(resource.id);
    resource.viewsCount++;
    this.resourcesService.viewResource(resource.id).subscribe({
      error: () => { resource.viewsCount--; },
    });
  }

  openResourceForm() {
    const subtopicId = this.subtopicDetail()?.subTopicDetail?.items?.[0]?.subTopic?.id;
    if (!subtopicId) return;
    this.resourceForm = {
      title: '', url: '', description: '', subTopicId: subtopicId,
      author: '', sourceName: '', publishedAt: '', type: ResourceContentType.Otros,
    };
    this.showResourceForm = true;
  }

  closeResourceForm() {
    this.showResourceForm = false;
  }

  submitResource() {
    if (!this.resourceForm.title.trim() || !this.resourceForm.url.trim()) {
      this.toastService.error('El título y la URL son obligatorios.');
      return;
    }
    this.isCreatingResource = true;
    this.resourcesService.createResource(this.resourceForm).subscribe({
      next: (res) => {
        this.isCreatingResource = false;
        if (res.success) {
          this.toastService.success('Recurso registrado correctamente y está en proceso de aprobación pública.');
          this.showResourceForm = false;
          const subtopicId = this.resourceForm.subTopicId;
          this.resourcePage = 1;
          if (subtopicId) this.loadResources(subtopicId);
        } else {
          this.toastService.error(res.message || 'Error al registrar el recurso.');
        }
      },
      error: () => {
        this.isCreatingResource = false;
        this.toastService.error('Error al registrar el recurso.');
      },
    });
  }

  goToUserProfile(code: string) {
    this.router.navigate(['/users/public-profile', code.toLowerCase()]);
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
