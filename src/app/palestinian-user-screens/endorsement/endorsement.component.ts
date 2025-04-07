import { Component } from '@angular/core';
import { IncomingEndorsementsChecksPanelComponent } from './incoming-endorsements-checks-panel/incoming-endorsements-checks-panel.component';
import { OutcomingEndorsementsChecksPanelComponent } from './outcoming-endorsements-checks-panel/outcoming-endorsements-checks-panel.component';
import { ReceivedChecksForEndorsementsChecksPanelComponent } from './received-checks-for-endorsements-checks-panel/received-checks-for-endorsements-checks-panel.component';

@Component({
  selector: 'app-endorsement',
  standalone: true,
  imports: [
    IncomingEndorsementsChecksPanelComponent,
    OutcomingEndorsementsChecksPanelComponent,
    ReceivedChecksForEndorsementsChecksPanelComponent,
  ],
  templateUrl: './endorsement.component.html',
  styleUrl: './endorsement.component.scss',
})
export class EndorsementComponent {}
