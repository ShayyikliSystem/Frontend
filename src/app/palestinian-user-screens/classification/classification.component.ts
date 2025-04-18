import { Component } from '@angular/core';
import { GeneralInfoPanelComponent } from '../dashboard-screen/general-info-panel/general-info-panel.component';
import { CreateSettlementPanelComponent } from './create-settlement-panel/create-settlement-panel.component';
import { HistorySettlmentPanelComponent } from './history-settlment-panel/history-settlment-panel.component';
import { ResponseSettlmentPanelComponent } from './response-settlment-panel/response-settlment-panel.component';

@Component({
  selector: 'app-classification',
  standalone: true,
  imports: [
    GeneralInfoPanelComponent,
    CreateSettlementPanelComponent,
    HistorySettlmentPanelComponent,
    ResponseSettlmentPanelComponent,
  ],
  templateUrl: './classification.component.html',
  styleUrl: './classification.component.scss',
})
export class ClassificationComponent {}
