import { Component, OnDestroy } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbThemeService, NbToastrConfig, NbToastRef, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnDestroy {

  toastRef: NbToastRef;

  config: NbToastrConfig;

  destroyByClick = true;
  duration = 0;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  preventDuplicates = true;
  status: NbComponentStatus = 'info';

  title = 'Czy wiesz już czym są Statystyki?';
  content = `To szczegółowe dane dotyczące zużycia wody w kolejnych godzinach, dniach i miesiącach wraz z informacją o średnim zużyciu wyliczonym na podstawie danych archiwalnych.`;

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
