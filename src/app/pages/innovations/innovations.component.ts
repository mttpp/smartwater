import { Component, OnDestroy } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbThemeService, NbToastrConfig, NbToastRef, NbToastrService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../@core/data/solar';


@Component({
  selector: 'ngx-innovations',
  styleUrls: ['./innovations.component.scss'],
  templateUrl: './innovations.component.html',
})
export class InnovationsComponent implements OnDestroy {

  toastRef: NbToastRef;

  config: NbToastrConfig;

  destroyByClick = true;
  duration = 0;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = true;
  status: NbComponentStatus = 'info';

  title = 'Czy wiesz już czym jest Analiza danych?';
  content = `To moduł wsparty AI, który pozwala przypisać zużycie do danej kategorii, dzięki czemu możemy w prosty sposób zweryfikować gdzie, kiedy i na co marnujemy najwięcej wody.`;

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
