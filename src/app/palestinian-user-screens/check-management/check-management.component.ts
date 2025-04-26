import { Component } from '@angular/core';
import { IssuedChecksPanelComponent } from './issued-checks-panel/issued-checks-panel.component';
import { ReceivedChecksPanelComponent } from './received-checks-panel/received-checks-panel.component';
import { RequestIssueCheckPanelComponent } from './request-issue-check-panel/request-issue-check-panel.component';
import { ReturnedChecksPanelComponent } from './returned-checks-panel/returned-checks-panel.component';
import { SettleChecksPanelComponent } from './settle-checks-panel/settle-checks-panel.component';

@Component({
  selector: 'app-check-management',
  standalone: true,
  imports: [
    IssuedChecksPanelComponent,
    ReceivedChecksPanelComponent,
    RequestIssueCheckPanelComponent,
    ReturnedChecksPanelComponent,
    SettleChecksPanelComponent
  ],
  templateUrl: './check-management.component.html',
  styleUrl: './check-management.component.scss',
})
export class CheckManagementComponent {}
