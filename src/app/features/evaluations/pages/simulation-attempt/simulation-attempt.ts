import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { GeneralModal } from '../../../../shared/ui/modal/general-modal/general-modal';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { EvaluationsService } from '../../services/evaluations.service';
import {
  StartAssessmentAttemptSimulationResponse,
  AttemptQuestionDto,
  AttemptOptionDto,
  SubmitAssessmentResponse,
} from '../../models/evaluations-response.model';

@Component({
  selector: 'app-simulation-attempt',
  imports: [PrimaryButton, SecondaryButton, GeneralModal],
  templateUrl: './simulation-attempt.html',
  styleUrl: './simulation-attempt.css',
})
export class SimulationAttempt implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private evaluationsService = inject(EvaluationsService);
  private toastService = inject(ToastService);

  public isLoading = true;
  public hasError = false;
  public attemptData: StartAssessmentAttemptSimulationResponse | null = null;
  public currentIndex = 0;
  public selectedOptions: Record<number, number> = {};
  public resultData: SubmitAssessmentResponse | null = null;
  public isSubmitting = false;
  public showFinishModal = false;
  public timerSeconds = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnDestroy() {
    this.stopTimer();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const assessmentId = params.get('assessmentId');
      const generationMode = params.get('generationMode');

      if (!assessmentId || !generationMode) {
        this.hasError = true;
        this.isLoading = false;
        return;
      }

      this.startAttempt(Number(assessmentId), generationMode);
    });
  }

  private startAttempt(assessmentId: number, generationMode: string) {
    this.isLoading = true;
    this.hasError = false;
    this.evaluationsService.startSimulationAttempt(assessmentId, generationMode).subscribe({
      next: res => {
        this.attemptData = res.data ?? null;
        this.isLoading = false;
        const seconds = this.attemptData?.timeLimitSeconds ?? 0;
        if (seconds > 0) this.startTimer(seconds);
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
        this.toastService.error('Error al iniciar el simulacro.');
      },
    });
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

  get generationModeLabel(): string {
    const mode = this.attemptData?.generationModeUsed;
    if (mode === 'RANDOM' || mode === '0') return 'Aleatorio';
    if (mode === 'BALANCED' || mode === '1') return 'Balanceado';
    if (mode === 'WEAKNESSFOCUS' || mode === '2') return 'Enfocado en debilidades';
    return String(mode ?? '');
  }

  get formattedTimeLimit(): string {
    if (!this.attemptData?.timeLimitSeconds) return '';
    const hours = Math.floor(this.attemptData.timeLimitSeconds / 3600);
    const minutes = Math.floor((this.attemptData.timeLimitSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes} minutos`;
  }

  get questionIndexes(): number[] {
    return Array.from({ length: this.totalQuestions }, (_, i) => i);
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.totalQuestions) {
      this.currentIndex = index;
    }
  }

  onSelectOption(questionId: number, optionId: number) {
    this.selectedOptions = { ...this.selectedOptions, [questionId]: optionId };
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
    this.submitAttempt(false);
  }

  goBack() {
    this.router.navigate(['/app/evaluations/simulations']);
  }

  private startTimer(seconds: number) {
    this.stopTimer();
    this.timerSeconds = seconds;
    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      if (this.timerSeconds <= 0) {
        this.timerSeconds = 0;
        this.stopTimer();
        this.submitAttempt(true);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  get formattedTimer(): string {
    const t = this.timerSeconds;
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  get timerPercentage(): number {
    if (!this.attemptData?.timeLimitSeconds || this.attemptData.timeLimitSeconds === 0) return 0;
    return (this.timerSeconds / this.attemptData.timeLimitSeconds) * 100;
  }

  get timerWarning(): boolean {
    return this.timerSeconds > 0 && this.timerSeconds <= 60;
  }

  get timerDanger(): boolean {
    return this.timerSeconds > 0 && this.timerSeconds <= 30;
  }

  private submitAttempt(isAutoSubmit: boolean) {
    if (!this.attemptData || this.isSubmitting) return;
    this.showFinishModal = false;
    this.isSubmitting = true;
    const answers = this.attemptData.questions.map(q => ({
      questionId: q.questionId,
      selectedOptionId: this.selectedOptions[q.questionId],
    }));
    this.evaluationsService
      .submitAssessmentAttempt(
        0,
        this.attemptData.assessmentId,
        this.attemptData.attemptId,
        {
          syllabusSlug: '',
          unitSlug: null,
          answers,
        },
      )
      .subscribe({
        next: res => {
          this.resultData = res.data ?? null;
          this.isSubmitting = false;
          if (isAutoSubmit) {
            this.toastService.info('Se ha agotado el tiempo. El simulacro se ha enviado automáticamente.');
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.toastService.error('Error al enviar el simulacro.');
        },
      });
  }
}
