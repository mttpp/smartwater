import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { ProfitChart } from '../../../../@core/data/profit-chart';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'ngx-radar-chart',
  styleUrls: ['./charts-common2.component.scss'],
  template: `
    <div echarts [options]="options" class="echart" (chartInit)="onChartInit($event)"></div>
  `,
})
export class RadarChartComponent implements AfterViewInit, OnDestroy, OnChanges {

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
        text: 'Średnie zużycie wg. kategorii',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'inner',
            formatter: '{c} m3',
            fontSize: 12
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 3, name: 'Wanna' },
            { value: 2, name: 'Prysznic' },
            { value: 1.75, name: 'Kuchnia' },
            { value: 1.5, name: 'Pralka' },
            { value: 1, name: 'Umywalka' },
            { value: 1, name: 'WC' },
            { value: 0.4, name: 'Wycieki' }
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
