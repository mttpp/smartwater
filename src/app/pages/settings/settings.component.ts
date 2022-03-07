import {
  Component,
  OnDestroy
} from '@angular/core';
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbThemeService,
  NbToastrConfig,
  NbToastRef,
  NbToastrService
} from '@nebular/theme';

import {
  takeWhile
} from 'rxjs/operators';
import {
  SolarData
} from '../../@core/data/solar';


@Component({
  selector: 'ngx-settings',
  styleUrls: ['./settings.component.scss'],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnDestroy {

  toastRef: NbToastRef;

  config: NbToastrConfig;

  destroyByClick = true;
  duration = 0;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = true;
  status: NbComponentStatus = 'info';

  title = 'Czy wiesz już czym jest Mój dom?';
  content = `To szczegółowa Twojego miejsca zamieszkania, w tym przykładzie mówimy o typowym M2, mieszkaniu o powierzchni ok 50m2, 2 pokojach i 4 mieszkańcach. Mieszkanie to posiada cztery punkty poboru wody (2 ciepłej i 2 zimnej) oraz dodatkowe przyłącza na pralkę i zmywarkę.`;


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
