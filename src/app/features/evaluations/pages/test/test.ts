import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { GeneralModal } from '../../../../shared/ui/modal/general-modal/general-modal';
import { EvaluationsService } from '../../services/evaluations.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import {
  TestInfo,
  StartAssessmentAttemptResponse,
  AttemptQuestionDto,
  AttemptOptionDto,
  SubmitAssessmentResponse,
  TestHistoryItem,
  GetAttemptDetailResponse,
  AttemptQuestionDetailDto,
  AttemptOptionDetailDto,
} from '../../models/evaluations-response.model';

@Component({
  selector: 'app-test',
  imports: [PrimaryButton, SecondaryButton, StarRating, DatePipe, GeneralModal],
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
  public resultData: SubmitAssessmentResponse | null = null;
  public isSubmitting = false;
  public testHistory: TestHistoryItem[] = [];
  public attemptDetail: GetAttemptDetailResponse | null = null;
  public isLoadingDetail = false;
  public detailCurrentIndex = 0;
  public showFinishModal = false;

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
        this.loadTestHistory();
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
        this.toastService.error('Error al cargar la información de la prueba.');
      },
    });
  }

  public loadTestHistory() {
    this.evaluationsService.getTestHistory(this.userLearningContextId, this.syllabusSlug, this.unitSlug).subscribe({
      next: res => {
        this.testHistory = res.data?.history ?? [];
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

  get sortedOptions(): AttemptOptionDto[] {
    const q = this.currentQuestion;
    if (!q) return [];
    return [...q.options].sort((a, b) => a.label.localeCompare(b.label));
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
    if (!this.canAttempt || !this.testInfo || this.isStarting) return;
    this.isStarting = true;
    this.evaluationsService
      .startAssessmentAttempt(this.userLearningContextId, this.testInfo.assessmentId)
      .subscribe({
        next: res => {
          this.attemptData = res.data ?? null;
          this.isStarting = false;
          this.currentIndex = 0;
          this.selectedOptions = {};
          this.resultData = null;
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

  viewAttemptDetail(attemptId: number) {
    this.isLoadingDetail = true;
    this.attemptDetail = null;
    this.detailCurrentIndex = 0;
    this.evaluationsService.getAttemptDetail(this.userLearningContextId, attemptId).subscribe({
      next: res => {
        this.attemptDetail = res.data ?? null;
        this.isLoadingDetail = false;
      },
      error: () => {
        this.isLoadingDetail = false;
        this.toastService.error('Error al cargar el detalle del intento.');
      },
    });
  }

  closeDetail() {
    this.attemptDetail = null;
    this.detailCurrentIndex = 0;
  }

  get detailTotalQuestions(): number {
    return this.attemptDetail?.totalQuestions ?? 0;
  }

  get detailQuestionIndexes(): number[] {
    return Array.from({ length: this.detailTotalQuestions }, (_, i) => i);
  }

  get currentDetailQuestion(): AttemptQuestionDetailDto | null {
    if (!this.attemptDetail) return null;
    return this.attemptDetail.questions[this.detailCurrentIndex] ?? null;
  }

  get sortedDetailOptions(): AttemptOptionDetailDto[] {
    const q = this.currentDetailQuestion;
    if (!q) return [];
    return [...q.options].sort((a, b) => a.label.localeCompare(b.label));
  }

  get hasDetailNext(): boolean {
    return this.detailCurrentIndex < this.detailTotalQuestions - 1;
  }

  get hasDetailPrev(): boolean {
    return this.detailCurrentIndex > 0;
  }

  goToDetailQuestion(index: number) {
    if (index >= 0 && index < this.detailTotalQuestions) {
      this.detailCurrentIndex = index;
    }
  }

  openFinishModal() {
    this.showFinishModal = true;
  }

  closeFinishModal() {
    this.showFinishModal = false;
  }

  get answeredCount(): number {
    return Object.keys(this.selectedOptions).length;
  }

  onFinish() {
    if (!this.attemptData || !this.testInfo || this.isSubmitting) return;
    this.showFinishModal = false;
    this.isSubmitting = true;
    const answers = this.attemptData.questions.map(q => ({
      questionId: q.questionId,
      selectedOptionId: this.selectedOptions[q.questionId],
    }));
    this.evaluationsService
      .submitAssessmentAttempt(
        this.userLearningContextId,
        this.attemptData.assessmentId,
        this.attemptData.attemptId,
        {
          syllabusSlug: this.syllabusSlug,
          unitSlug: this.unitSlug ?? null,
          answers,
        },
      )
      .subscribe({
        next: res => {
          this.resultData = res.data ?? null;
          this.isSubmitting = false;
        },
        error: () => {
          this.isSubmitting = false;
          this.toastService.error('Error al enviar la prueba.');
        },
      });
  }

  goBack() {
    this.router.navigate(['/app/my-syllabi', this.userLearningContextId, this.syllabusSlug]);
  }
}
