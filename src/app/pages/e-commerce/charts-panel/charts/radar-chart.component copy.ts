import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { ProfitChart } from '../../../../@core/data/profit-chart';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'ngx-radar-chart',
  styleUrls: ['./charts-common.component.scss'],
  template: `
    <div echarts [options]="options" class="echart" (chartInit)="onChartInit($event)"></div>
  `,
})
export class RadarChartComponent2 implements AfterViewInit, OnDestroy, OnChanges {

  @Input()
  profitChartData: ProfitChart;

  private alive = true;

  echartsIntance: any;
  options: any = {};

  constructor(private theme: NbThemeService,
    private layoutService: LayoutService) {
    this.layoutService.onSafeChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngOnChanges(): void {
    if (this.echartsIntance) {
      this.updateProfitChartOptions(this.profitChartData);
    }
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        const eTheme: any = config.variables.profit;

        this.setOptions(eTheme);
      });
  }

  setOptions(eTheme) {
    this.options = {
      title: {
        text: 'Zużycie właściwe vs średnie wg. kategorii'
      },
      tooltip: {
        show: 'true'
      },
      legend: {
        data: ['Zużycie wody', 'Zużycie średnie']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: 'Mycie rąk i zębów', max: 6500 },
          { name: 'Kąpiel', max: 16000 },
          { name: 'Pranie', max: 30000 },
          { name: 'Zmywanie', max: 38000 },
          { name: 'Gotowanie', max: 52000 },
          { name: 'Wycieki', max: 25000 },
          { name: 'Inne', max: 25000 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000, 18000],
              name: 'Zużycie wody'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000, 18000],
              name: 'Zużycie średnie'
            }
          ]
        }
      ]
    };
  }

  updateProfitChartOptions(profitChartData: ProfitChart) {
    const options = this.options;
    const series = this.getNewSeries(options.series, profitChartData.data);

    this.echartsIntance.setOption({
      series: series,
      xAxis: {
        data: this.profitChartData.chartLabel,
      },
    });
  }

  getNewSeries(series, data: number[][]) {
    return series.map((line, index) => {
      return {
        ...line,
        data: data[index],
      };
    });
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  resizeChart() {
    if (this.echartsIntance) {
      // Fix recalculation chart size
      // TODO: investigate more deeply
      setTimeout(() => {
        this.echartsIntance.resize();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
