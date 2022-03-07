import { Component, OnDestroy } from '@angular/core';
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbThemeService,
  NbToastrConfig,
  NbToastRef,
  NbToastrService
} from '@nebular/theme'; import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../@core/data/solar';

interface CardSettings {
  title: string;
  value: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Zużycie Dziś',
    value: "0,5 m3",
    iconClass: 'nb-drop',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Zużycie Listopad',
    value: "10 m3",
    iconClass: 'nb-drops',
    type: 'primary',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Okres rozliczeniowy',
    value: "60 m3",
    iconClass: 'nb-bar-chart',
    type: 'info',
  };
  cost: CardSettings = {
    title: 'Szacowany koszt',
    value: "123 zł",
    iconClass: 'nb-flame-circled',
    type: 'danger',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.cost
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.lightCard,
          type: 'warning',
        },
        {
          ...this.rollerShadesCard,
          type: 'primary',
        },
        {
          ...this.wirelessAudioCard,
          type: 'danger',
        },
      ],
      dark: this.commonStatusCardsSet,
    };

  toastRef: NbToastRef;

  config: NbToastrConfig;

  destroyByClick = true;
  duration = 0;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = true;
  status: NbComponentStatus = 'info';

  title = 'Czy wiesz już czym jest Twój dashboard?';
  content = `Prezentujemy tutaj zagregowane informacje o aktulanym stanie licznika w formie zużycia bieżącego dziś, w tym miesiącu oraz w tym okresie rozliczeniowym. Znajduje się tutaj również zużycie podzielone przy pomocy AI na właściwe kategorie. Ekran główny to również rekomentacje, wygenerowane na podstawie aktualnego sposobu zużycia wody.`;

  constructor(private themeService: NbThemeService,
    private solarService: SolarData,
    private toastrService: NbToastrService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });

    this.showToast(this.status, this.title, this.content);

  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };

    this.toastRef = this.toastrService.show(
      body,
      title,
      config);

  }

  ngOnDestroy() {
    this.alive = false;
    this.toastRef.close();

  }
}
