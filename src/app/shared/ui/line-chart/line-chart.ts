import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

export interface ChartTooltipItem {
  assessmentTitle: string;
  score: number;
  totalQuestions: number;
  finishedAt: string;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="w-full h-64">
      <canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'line'" [legend]="true"></canvas>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
    `
  ]
})
export class LineChart implements OnChanges {
  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() tooltipData: ChartTooltipItem[] = [];

  public chartData: any = {
    labels: this.labels,
    datasets: [
      {
        data: this.values,
        borderColor: 'var(--color-primary)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'var(--color-primary)',
        pointBorderColor: '#fff',
        fill: false,
        tension: 0.4,
        label: 'Puntaje %'
      }
    ]
  };

  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: true, title: { display: true, text: 'Fecha' } },
      y: { display: true, title: { display: true, text: 'Puntaje' }, beginAtZero: true }
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const item = this.tooltipData[index];
            if (!item) return `Puntaje: ${context.raw}%`;
            return [
              `Puntaje: ${context.raw}%`,
              `Aciertos: ${item.score}/${item.totalQuestions}`,
              `Simulacro: ${item.assessmentTitle}`,
              `Fecha: ${new Date(item.finishedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}`
            ];
          }
        }
      },
      legend: { display: true, position: 'top' }
    }
  };

  ngOnChanges(): void {
    this.chartData = {
      ...this.chartData,
      labels: this.labels,
      datasets: [{ ...this.chartData.datasets[0], data: this.values }]
    };
  }
}
