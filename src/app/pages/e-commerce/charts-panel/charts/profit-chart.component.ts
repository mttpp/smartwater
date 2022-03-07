import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { ProfitChart } from '../../../../@core/data/profit-chart';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'ngx-profit-chart',
  styleUrls: ['./charts-common.component.scss'],
  template: `
    <div echarts [options]="options" class="echart" (chartInit)="onChartInit($event)"></div>
  `,
})
export class ProfitChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input()
  profitChartData: ProfitChart;

  private alive = true;

  colors = ['#0000ff', '#ff0000'];

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
      color: ['#0000ff', '#ff0000'],
      title: {
        text: 'Średnie zużycie',
        subtext: 'Dane skategoryzowane przy pomocy AI'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: 25,
        containLabel: true,
        bottom: 10,
        top: 100,
        right: 25
      },
      legend: {
        data: ['Woda Zimna', 'Woda Ciepła']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        // prettier-ignore
        data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} m3'
        },
        axisPointer: {
          snap: true
        }
      },
      series: [
        {
          name: 'Woda Zimna',
          type: 'line',
          smooth: true,
          // prettier-ignore
          data: [0.00, 0.00, 0.00, 0.00, 0.00, 0.025, 0.035, 0.01, 0.00, 0.00, 0.00, 0.05, 0.1, 0.01, 0.00, 0.00, 0.2, 0.01, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
          markArea: {
            itemStyle: {
              color: 'rgba(0, 0, 255, 0.2)'
            },
            data: [
              [
                {
                  name: 'Poranne WC',
                  xAxis: '05:00'
                },
                {
                  xAxis: '07:00'
                }
              ],
              [
                {
                  name: 'Pranie',
                  xAxis: '10:00'
                },
                {
                  xAxis: '13:00'
                }
              ],
              [
                {
                  name: 'Gotowanie',
                  xAxis: '16:00'
                },
                {
                  xAxis: '17:00'
                }
              ]
            ]
          }
        },
        {
          name: 'Woda Ciepła',
          type: 'line',
          smooth: true,
          // prettier-ignore
          data: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.15, 0.25, 0.1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.05, 0.01, 0.01, 0.00, 0.00, 0.1, 0.3, 0.1, 0.00],
          markArea: {
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.4)'
            },
            data: [
              [
                {
                  name: 'Mycie zębów',
                  xAxis: '07:00'
                },
                {
                  xAxis: '09:00'
                }
              ],
              [
                {
                  name: 'Mycie rąk',
                  xAxis: '14:00'
                },
                {
                  xAxis: '15:00'
                }
              ],
              [
                {
                  name: 'Kąpiel',
                  xAxis: '20:00'
                },
                {
                  xAxis: '22:00'
                }
              ]
            ]
          }
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
