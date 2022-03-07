import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';

import { OrdersChart } from '../../../../@core/data/orders-chart';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'ngx-orders-chart-yearly',
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
export class YearlyChartComponent implements AfterViewInit, OnDestroy, OnChanges {

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
          data: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Zużycie wody',
          min: 0,
          max: 15,
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
          max: 15,
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
            12.38, 12.53, 11.49, 10.17, 11.56, 7.4, 5.45, 8.04, 12.74, 8.27
          ]
        },
        {
          name: 'Woda Ciepła',
          type: 'bar',
          data: [
            5.93, 11.5, 12.62, 12.61, 7.67, 10.46, 10.69, 12.16, 12.45, 8.04
          ]
        },
        {
          name: 'Woda Zimna - średnie',
          type: 'line',
          color: this.colors[0],
          yAxisIndex: 1,
          data: [7.18, 6.59, 8.84, 6.93, 6.08, 5.5, 5.83, 7.69, 9.89, 9.58, 10.3, 12.35]
        },
        {
          name: 'Woda Ciepła - średnie',
          type: 'line',
          color: this.colors[1],
          yAxisIndex: 1,
          data: [5.48, 7.13, 11.98, 9.04, 10.44, 12.95, 8.97, 8.13, 6.57, 11.34, 10.98, 6.03]
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
