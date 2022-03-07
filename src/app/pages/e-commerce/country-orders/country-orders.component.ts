import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { CountryOrderData } from '../../../@core/data/country-order';

@Component({
  selector: 'ngx-country-orders',
  styleUrls: ['./country-orders.component.scss'],
  template: `
    <nb-card id="cardID" [size]="breakpoint.width >= breakpoints.md ? 'medium' : 'giant'">
      <nb-card-header>Średnie zużycie w województwach</nb-card-header>
      <nb-card-body>
        <ngx-country-orders-map (select)="selectCountryById($event)"
                                countryId="małopolskie">
        </ngx-country-orders-map>
        <ngx-country-orders-chart [countryName]="countryName"
                                  [data]="countryData"
                                  [labels]="countriesCategories"
                                  maxValue="20">
        </ngx-country-orders-chart>
      </nb-card-body>
    </nb-card>
  `,
})
export class CountryOrdersComponent implements OnInit, OnDestroy {

  private alive = true;

  countryName = 'małopolskie';
  countryData: number[] = [];
  countriesCategories: string[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;

  constructor(private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private countryOrderService: CountryOrderData) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
  }

  ngOnInit() {
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    this.countryOrderService.getCountriesCategories()
      .pipe(takeWhile(() => this.alive))
      .subscribe((countriesCategories) => {
        this.countriesCategories = countriesCategories;
      });
  }

  selectCountryById(countryName: string) {
    this.countryName = countryName;

    this.countryOrderService.getCountriesCategoriesData(countryName)
      .pipe(takeWhile(() => this.alive))
      .subscribe((countryData) => {
        this.countryData = countryData;
        if (this.countryName != 'małopolskie') {
          const element = document.getElementById('cardID')
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
