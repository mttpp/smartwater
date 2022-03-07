import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';

import { OrdersChart } from '../../../../@core/data/orders-chart';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'ngx-orders-chart-daily',
  styleUrls: ['./charts-common.component.scss'],
  template: `
    <div echarts
         [options]="option"
         [merge]="option"
         class="echart"
         (chartInit)="onChartInit($event)">
    </div>
  `,
})
export class DailyChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input()
  ordersChartData: OrdersChart;

  private alive = true;

  colors = ['#0000ff', '#ff0000'];

  echartsIntance: any;
  option: any;

  ngOnChanges(): void {
    if (this.option) {
      //this.updateOrdersChartOptions(this.ordersChartData);
    }
  }

  constructor(private theme: NbThemeService,
    private layoutService: LayoutService) {
    this.layoutService.onSafeChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngAfterViewInit(): void {
    this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
      )
      .subscribe(config => {
        const eTheme: any = config.variables.orders;

        this.setOptions(eTheme);
        //this.updateOrdersChartOptions(this.ordersChartData);
      });
  }

  setOptions(eTheme) {
    this.option = {
      color: this.colors,
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
        data: ['Woda Zimna', 'Woda Ciepła', 'Woda Zimna - średnie', 'Woda Ciepła - średnie']
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          // prettier-ignore
          data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Zużycie wody',
          min: 0,
          max: 0.5,
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'black'
            }
          },
          axisLabel: {
            formatter: '{value} m3'
          }
        },
        {
          type: 'value',
          name: 'Średnie zużycie',
          min: 0,
          max: 0.5,
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'green'
            }
          },
          axisLabel: {
            formatter: '{value} m3'
          }
        }
      ],
      series: [
        {
          name: 'Woda Zimna',
          type: 'bar',
          data: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.0, 0.2, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.01, 0.3, 0.05, 0.00, 0.00, 0.05, 0.2, 0.0, 0.00]
        },
        {
          name: 'Woda Ciepła',
          type: 'bar',
          data: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.0, 0.1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.01, 0.1, 0.01, 0.00, 0.00, 0.1, 0.5, 0.01, 0.00],
        },
        {
          name: 'Woda Zimna - średnie',
          type: 'line',
          color: this.colors[0],
          yAxisIndex: 1,
          data: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.15, 0.25, 0.01, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.01, 0.05, 0.1, 0.00, 0.00, 0.05, 0.1, 0.01, 0.00]
        },
        {
          name: 'Woda Ciepła - średnie',
          type: 'line',
          color: this.colors[1],
          yAxisIndex: 1,
          data: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.025, 0.035, 0.01, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.05, 0.01, 0.01, 0.00, 0.00, 0.1, 0.3, 0.1, 0.00]
        }
      ]
    };
  }

  getFirstLine(eTheme) {
    return {
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          opacity: 0,
        },
      },
      lineStyle: {
        normal: {
          width: 0,
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.firstAreaGradFrom,
          }, {
            offset: 1,
            color: eTheme.firstAreaGradTo,
          }]),
          opacity: 1,
        },
      },
      data: [],
    };
  }

  getSecondLine(eTheme) {
    return {
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          color: '#ffffff',
          borderColor: eTheme.itemBorderColor,
          borderWidth: 2,
          opacity: 1,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.lineWidth,
          type: eTheme.lineStyle,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.secondLineGradFrom,
          }, {
            offset: 1,
            color: eTheme.secondLineGradTo,
          }]),
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.secondAreaGradFrom,
          }, {
            offset: 1,
            color: eTheme.secondAreaGradTo,
          }]),
        },
      },
      data: [],
    };
  }

  getThirdLine(eTheme) {
    return {
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          color: '#ffffff',
          borderColor: eTheme.itemBorderColor,
          borderWidth: 2,
          opacity: 1,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.lineWidth,
          type: eTheme.lineStyle,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.thirdLineGradFrom,
          }, {
            offset: 1,
            color: eTheme.thirdLineGradTo,
          }]),
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.thirdAreaGradFrom,
          }, {
            offset: 1,
            color: eTheme.thirdAreaGradTo,
          }]),
        },
      },
      data: [],
    };
  }

  updateOrdersChartOptions(ordersChartData: OrdersChart) {
    const options = this.option;
    const series = this.getNewSeries(options.series, ordersChartData.linesData);
    const xAxis = this.getNewXAxis(options.xAxis, ordersChartData.chartLabel);

    this.option = {
      ...options,
      xAxis,
      series,
    };
  }

  getNewSeries(series, linesData: number[][]) {
    return series.map((line, index) => {
      return {
        ...line,
        data: linesData[index],
      };
    });
  }

  getNewXAxis(xAxis, chartLabel: string[]) {
    return {
      ...xAxis,
      data: chartLabel,
    };
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

  ngOnDestroy() {
    this.alive = false;
  }
}
