import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { ProgressBar } from '../../../../shared/ui/progress-bar/progress-bar';
import { SubtopicDetailModal } from '../../components/subtopic-detail-modal/subtopic-detail-modal';
import { UsersService } from '../../../users/services/users.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import {
  UserSyllabusDetailData,
  UserSyllabusUnitData,
  UserSyllabusTopicData,
  UserSyllabusSubtopicData,
  AssessmentData,
} from '../../../users/models/user-syllabus-detail.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { GetUserSyllabusDetailResponse } from '../../../users/models/users-response.model';

@Component({
  selector: 'app-syllabus-detail',
  imports: [PrimaryButton, SecondaryButton, ProgressBar, SubtopicDetailModal],
  templateUrl: './syllabus-detail.html',
  styleUrl: './syllabus-detail.css',
})
export class SyllabusDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);

  public syllabus: UserSyllabusDetailData | null = null;
  public isLoading = true;
  public error = false;
  public learningContextId = 0;

  expandedUnits = new Set<number>();
  expandedTopics = new Set<number>();
  loadingUnits = new Set<number>();
  loadingTopics = new Set<number>();
  subtopicSlug: string | null = null;
  currentSubtopicSlugs: string[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const lcId = params.get('learningContextId');
      const slug = params.get('slug');

      if (!lcId || !slug) {
        this.error = true;
        this.isLoading = false;
        return;
      }

      this.learningContextId = Number(lcId);
      this.loadSyllabus(this.learningContextId, slug);
    });

    this.route.queryParams.subscribe(qp => {
      this.subtopicSlug = qp['subtopic'] ?? null;
    });
  }

  private loadSyllabus(learningContextId: number, slug: string) {
    this.isLoading = true;
    this.error = false;
    this.usersService.loadSyllabus(learningContextId, slug).subscribe({
      next: (res: ApiResponse<GetUserSyllabusDetailResponse>) => {
        if (res.data?.userSyllabus) {
          this.syllabus = {
            ...res.data.userSyllabus,
            finalSyllabusTest: res.data.finalSyllabusTest,
          };
        } else {
          this.syllabus = null;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
        this.toastService.error('Error al cargar el temario.');
      },
    });
  }

  toggleUnit(unit: UserSyllabusUnitData) {
    if (this.expandedUnits.has(unit.id)) {
      this.expandedUnits.delete(unit.id);
      return;
    }
    this.expandedUnits.add(unit.id);

    if (!unit.topics) {
      this.loadingUnits.add(unit.id);
      this.usersService.loadUnitTopics(this.learningContextId, unit.id).subscribe({
        next: res => {
          unit.topics = res.data?.topics ?? [];
          unit.unitTest = res.data?.unitTest;
          this.loadingUnits.delete(unit.id);
        },
        error: () => {
          this.loadingUnits.delete(unit.id);
          this.toastService.error('Error al cargar los temas de la unidad.');
        },
      });
    }
  }

  toggleTopic(topic: UserSyllabusTopicData) {
    if (this.expandedTopics.has(topic.id)) {
      this.expandedTopics.delete(topic.id);
      return;
    }
    this.expandedTopics.add(topic.id);

    if (!topic.subTopics) {
      this.loadingTopics.add(topic.id);
      this.usersService.loadTopicSubtopics(this.learningContextId, topic.id).subscribe({
        next: res => {
          topic.subTopics = res.data?.subTopics ?? [];
          this.loadingTopics.delete(topic.id);
        },
        error: () => {
          this.loadingTopics.delete(topic.id);
          this.toastService.error('Error al cargar los subtemas.');
        },
      });
    }
  }

  getUnitStatusLabel(status: string): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'EN PROCESO',
      FINISHED: 'TERMINADO',
      COMPLETED: 'COMPLETADO',
      APPROVED: 'APROBADO',
      LOCKED: 'NO INICIADO',
    };
    return map[status] ?? 'NO INICIADO';
  }

  getUnitBadgeClass(status: string): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'badge-amber',
      FINISHED: 'badge-green',
      COMPLETED: 'badge-green',
      APPROVED: 'badge-green',
      LOCKED: 'badge-gray',
    };
    return map[status] ?? 'badge-gray';
  }

  getTopicStatus(topic: UserSyllabusTopicData): string {
    if (!topic.subTopics || topic.subTopics.length === 0) {
      return topic.viewed ? 'VISTO' : 'NO VISTO';
    }
    const allViewed = topic.subTopics.every(s => s.viewed);
    const anyViewed = topic.subTopics.some(s => s.viewed);
    if (allViewed) return 'VISTO';
    if (anyViewed) return 'EN PROCESO';
    return 'NO VISTO';
  }

  getTopicBadgeClass(topic: UserSyllabusTopicData): string {
    const status = this.getTopicStatus(topic);
    const map: Record<string, string> = {
      VISTO: 'badge-green',
      'EN PROCESO': 'badge-amber',
      'NO VISTO': 'badge-gray',
    };
    return map[status] ?? 'badge-gray';
  }

  showSubtopicDetail(subtopic: UserSyllabusSubtopicData) {
    this.currentSubtopicSlugs = [];
    for (const unit of this.syllabus?.units ?? []) {
      for (const topic of unit.topics ?? []) {
        const match = topic.subTopics?.find(s => s.slug === subtopic.slug);
        if (match) {
          this.currentSubtopicSlugs = topic.subTopics!.map(s => s.slug);
          break;
        }
      }
      if (this.currentSubtopicSlugs.length) break;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { subtopic: subtopic.slug },
      queryParamsHandling: 'merge',
    });
  }

  onNavigateSubtopic(slug: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { subtopic: slug },
      queryParamsHandling: 'merge',
    });
  }

  closeSubtopicDetail() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { subtopic: null },
      queryParamsHandling: 'merge',
    });
  }

  retry() {
    this.route.paramMap.subscribe(params => {
      const lcId = params.get('learningContextId');
      const slug = params.get('slug');
      if (lcId && slug) {
        this.learningContextId = Number(lcId);
        this.loadSyllabus(this.learningContextId, slug);
      }
    });
  }

  goBack() {
    this.router.navigate(['/app/my-syllabi']);
  }

  getTestStatusLabel(status: string): string {
    const map: Record<string, string> = {
      NOT_STARTED: 'NO INICIADO',
      APPROVED: 'APROBADO',
      DISAPPROVED: 'DESAPROBADO',
    };
    return map[status] ?? 'NO INICIADO';
  }

  getTestBadgeClass(status: string): string {
    const map: Record<string, string> = {
      NOT_STARTED: 'badge-gray',
      APPROVED: 'badge-green',
      DISAPPROVED: 'badge-red',
    };
    return map[status] ?? 'badge-gray';
  }

  getTestButtonLabel(status: string): string {
    const map: Record<string, string> = {
      NOT_STARTED: 'Iniciar prueba',
      APPROVED: 'Ver resultados',
      DISAPPROVED: 'Reintentar',
    };
    return map[status] ?? 'Iniciar prueba';
  }

  goToTest(test: AssessmentData) {
    if (!this.syllabus?.slug) {
      this.toastService.info('Prueba no disponible.');
      return;
    }

    const unit = this.syllabus.units.find(u => u.unitTest === test);
    const unitSlug = unit?.slug;

    this.router.navigate([
      '/app/evaluations/tests',
      this.learningContextId,
      this.syllabus.slug,
      ...(unitSlug ? [unitSlug] : []),
    ]);
  }
}
