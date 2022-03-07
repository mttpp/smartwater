import { Component, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { DailyChartComponent } from './charts/daily-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from '../../../@core/data/orders-chart';
import { ProfitChart } from '../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';
import { MonthlyChartComponent } from './charts/monthly-chart.component';
import { YearlyChartComponent } from './charts/yearly-chart.component';

@Component({
  selector: 'ngx-ecommerce-charts',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ECommerceChartsPanelComponent implements OnDestroy {

  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = 'week';
  ordersChartData: OrdersChart;
  profitChartData: ProfitChart;

  @ViewChild('dailyChart', { static: true }) dailyChart: DailyChartComponent;
  @ViewChild('monthlyChart', { static: true }) monthlyChart: MonthlyChartComponent;
  @ViewChild('yearlyChart', { static: true }) yearlyChart: YearlyChartComponent;

  constructor(private ordersProfitChartService: OrdersProfitChartData) {
    this.ordersProfitChartService.getOrderProfitChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe((summary) => {
        this.chartPanelSummary = summary;
      });

    this.getOrdersChartData(this.period);
    this.getProfitChartData(this.period);
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Godzinowe') {
      this.dailyChart.resizeChart();
    } else if (selectedTab.tabTitle === 'Dziennie') {
      this.monthlyChart.resizeChart();
    } else if (selectedTab.tabTitle === 'Miesięcznie') {
      this.yearlyChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {
    this.ordersProfitChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });
  }

  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
