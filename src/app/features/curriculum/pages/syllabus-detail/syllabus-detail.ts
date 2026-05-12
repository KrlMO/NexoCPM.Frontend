import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { ProgressBar } from '../../../../shared/ui/progress-bar/progress-bar';
import { UsersService } from '../../../users/services/users.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import {
  UserSyllabusDetailData,
  UserSyllabusUnitData,
  UserSyllabusTopicData,
  UserSyllabusSubtopicData,
} from '../../../users/models/user-syllabus-detail.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { GetUserSyllabusDetailResponse } from '../../../users/models/users-response.model';

@Component({
  selector: 'app-syllabus-detail',
  imports: [SecondaryButton, ProgressBar],
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
  }

  private loadSyllabus(learningContextId: number, slug: string) {
    this.isLoading = true;
    this.error = false;
    this.usersService.loadSyllabus(learningContextId, slug).subscribe({
      next: (res: ApiResponse<GetUserSyllabusDetailResponse>) => {
        this.syllabus = res.data?.userSyllabus ?? null;
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
    };
    return map[status] ?? 'NO INICIADO';
  }

  getUnitBadgeClass(status: string): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'badge-amber',
      FINISHED: 'badge-green',
      COMPLETED: 'badge-green',
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
    this.toastService.info(`Detalles de este subtema" (próximamente).`);
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
}
