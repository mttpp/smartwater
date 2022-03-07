import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';

import { OrdersChart } from '../../../../@core/data/orders-chart';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'ngx-orders-chart-monthly',
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
export class MonthlyChartComponent implements AfterViewInit, OnDestroy, OnChanges {

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
          data: ['1.11', '2.11', '3.11', '4.11', '5.11', '6.11', '7.11', '8.11', '9.11', '10.11', '11.11', '12.11', '13.11', '14.11', '15.11', '16.11', '17.11', '18.11', '19.11', '20.11', '21.11', '22.11', '23.11', '24.11', '25.11', '26.11', '27.11', '28.11', '29.11', '30.11']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Zużycie wody',
          min: 0,
          max: 1,
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
          max: 1,
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
          data: [
            0.3, 0.4, 0.6, 0.4, 0.6
          ]
        },
        {
          name: 'Woda Ciepła',
          type: 'bar',
          data: [
            0.2, 0.1, 0.3, 0.2, 0.4
          ]
        },
        {
          name: 'Woda Zimna - średnie',
          type: 'line',
          color: this.colors[0],
          yAxisIndex: 1,
          data: [0.09, 0.47, 0.48, 0.23, 0.41, 0.28, 0.17, 0.17, 0.25, 0.45, 0.24, 0.28, 0.18, 0.27, 0.09, 0.28, 0.32, 0.1, 0.01, 0.38, 0.44, 0.47, 0.3, 0.07, 0.17, 0.29, 0.49, 0.32, 0.45, 0.06]
        },
        {
          name: 'Woda Ciepła - średnie',
          type: 'line',
          color: this.colors[1],
          yAxisIndex: 1,
          data: [0.38, 0.39, 0.4, 0.2, 0.15, 0.15, 0.2, 0.28, 0.18, 0.23, 0.1, 0.19, 0.43, 0.03, 0.49, 0.17, 0.34, 0.4, 0.44, 0.47, 0.13, 0.37, 0.06, 0.46, 0.39, 0.26, 0.09, 0.47, 0.17, 0.41]
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
