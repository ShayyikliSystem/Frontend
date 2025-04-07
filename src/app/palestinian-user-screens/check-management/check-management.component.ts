import { Component } from '@angular/core';
import { IssuedChecksPanelComponent } from './issued-checks-panel/issued-checks-panel.component';
import { ReceivedChecksPanelComponent } from './received-checks-panel/received-checks-panel.component';
import { RequestIssueCheckPanelComponent } from './request-issue-check-panel/request-issue-check-panel.component';

@Component({
  selector: 'app-check-management',
  standalone: true,
  imports: [
    IssuedChecksPanelComponent,
    ReceivedChecksPanelComponent,
    RequestIssueCheckPanelComponent,
  ],
  templateUrl: './check-management.component.html',
  styleUrl: './check-management.component.scss',
})
export class CheckManagementComponent {}
