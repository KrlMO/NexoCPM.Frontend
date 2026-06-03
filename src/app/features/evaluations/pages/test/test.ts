import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { EvaluationsService } from '../../services/evaluations.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import {
  TestInfo,
  StartAssessmentAttemptResponse,
  AttemptQuestionDto,
} from '../../models/evaluations-response.model';

@Component({
  selector: 'app-test',
  imports: [PrimaryButton, SecondaryButton],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private evaluationsService = inject(EvaluationsService);
  private toastService = inject(ToastService);

  public testInfo: TestInfo | null = null;
  public isLoading = true;
  public isStarting = false;
  public hasError = false;
  public userLearningContextId = 0;
  public syllabusSlug = '';
  public unitSlug: string | undefined;

  public attemptData: StartAssessmentAttemptResponse | null = null;
  public currentIndex = 0;
  public selectedOptions: Record<number, number> = {};

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const lcId = params.get('userLearningContextId');
      const slug = params.get('syllabusSlug');
      const uSlug = params.get('unitSlug');

      if (!lcId || !slug) {
        this.hasError = true;
        this.isLoading = false;
        return;
      }

      this.userLearningContextId = Number(lcId);
      this.syllabusSlug = slug;
      this.unitSlug = uSlug ?? undefined;

      this.loadTestInfo();
    });
  }

  public loadTestInfo() {
    this.isLoading = true;
    this.hasError = false;
    this.evaluationsService.getTestInfo(this.userLearningContextId, this.syllabusSlug, this.unitSlug).subscribe({
      next: res => {
        this.testInfo = res.data?.test ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
        this.toastService.error('Error al cargar la información de la prueba.');
      },
    });
  }

  get scopeLabel(): string {
    if (!this.testInfo) return '';
    return this.testInfo.scope === 'UNIT' ? 'Prueba de unidad' : 'Prueba final del temario';
  }

  get formattedTime(): string {
    if (!this.testInfo) return '';
    const hours = Math.floor(this.testInfo.timeLimitSeconds / 3600);
    const minutes = Math.floor((this.testInfo.timeLimitSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes} minutos`;
  }

  get canAttempt(): boolean {
    return !!this.testInfo && this.testInfo.attemptsRemaining > 0;
  }

  get currentQuestion(): AttemptQuestionDto | null {
    if (!this.attemptData) return null;
    return this.attemptData.questions[this.currentIndex] ?? null;
  }

  get totalQuestions(): number {
    return this.attemptData?.totalQuestions ?? 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.totalQuestions - 1;
  }

  get hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  onNewAttempt() {
    if (!this.canAttempt || !this.testInfo) return;
    this.isStarting = true;
    this.evaluationsService
      .startAssessmentAttempt(this.userLearningContextId, this.testInfo.assessmentId)
      .subscribe({
        next: res => {
          this.attemptData = res.data ?? null;
          this.isStarting = false;
          this.currentIndex = 0;
          this.selectedOptions = {};
        },
        error: () => {
          this.isStarting = false;
          this.toastService.error('Error al iniciar el intento.');
        },
      });
  }

  onSelectOption(questionId: number, optionId: number) {
    this.selectedOptions = { ...this.selectedOptions, [questionId]: optionId };
  }

  get questionIndexes(): number[] {
    return Array.from({ length: this.totalQuestions }, (_, i) => i);
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.totalQuestions) {
      this.currentIndex = index;
    }
  }

  onFinish() {
    this.toastService.info('Funcionalidad de finalización próxima.');
  }

  goBack() {
    this.router.navigate(['/app/my-syllabi', this.userLearningContextId, this.syllabusSlug]);
  }
}
