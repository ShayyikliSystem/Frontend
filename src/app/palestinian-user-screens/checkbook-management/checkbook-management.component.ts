import { Component } from '@angular/core';
import { CheckbookHistoryPanelComponent } from './checkbook-history-panel/checkbook-history-panel.component';
import { CheckbookInfoPanelComponent } from './checkbook-info-panel/checkbook-info-panel.component';

@Component({
  selector: 'app-checkbook-management',
  standalone: true,
  imports: [CheckbookInfoPanelComponent, CheckbookHistoryPanelComponent],
  templateUrl: './checkbook-management.component.html',
  styleUrl: './checkbook-management.component.scss',
})
export class CheckbookManagementComponent {}
