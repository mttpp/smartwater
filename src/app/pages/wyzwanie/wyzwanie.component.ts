import { Component, OnDestroy } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbThemeService, NbToastrConfig, NbToastRef, NbToastrService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../@core/data/solar';


@Component({
  selector: 'ngx-wyzwanie',
  styleUrls: ['./wyzwanie.component.scss'],
  templateUrl: './wyzwanie.component.html',
})
export class WyzwanieComponent implements OnDestroy {

  img = 'https://mttpp.github.io/smartwater/assets/images/las.png';

  toastRef: NbToastRef;

  config: NbToastrConfig;

  destroyByClick = true;
  duration = 0;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = true;
  status: NbComponentStatus = 'info';

  title = 'Czy wiesz już czym jest Wyzwanie?';
  content = `Aby zmotywować użytkowników do oszczędzania wody, zwłaszcza najmłodsze pokolenie, przygotowaliśmy grę: Po Kropelce, umożliwiającą zbieranie kropelek wody. Celem gry jest zalesienie jak największego terenu. Gra wspiera systematyczność, premiując ją dodatkowymi kropelkami. Wykonując zadania i zdobywając osiągnięcia użytkownik może przyspieszyć proces sadzenia kolejnych drzew.`;

  constructor(private toastrService: NbToastrService) {


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
    this.toastRef.close();
  }


}
