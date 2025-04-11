import { Component } from '@angular/core';
import { SupportFormComponent } from './support-form/support-form.component';
import { AlertComponent } from '../../alert/alert.component';
import { SupportHistoryPanelComponent } from './support-history-panel/support-history-panel.component';
import { SupportHistoryFilterComponent } from './support-history-filter/support-history-filter.component';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [SupportFormComponent, AlertComponent, SupportHistoryPanelComponent],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
})
export class SupportComponent {
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  handleAlert(event: { message: string; type: 'success' | 'error' }): void {
    this.alertMessage = event.message;
    this.alertType = event.type;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }
}
