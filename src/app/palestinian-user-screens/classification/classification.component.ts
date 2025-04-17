import { Component } from '@angular/core';
import { GeneralInfoPanelComponent } from '../dashboard-screen/general-info-panel/general-info-panel.component';
import { CreateSettlementPanelComponent } from './create-settlement-panel/create-settlement-panel.component';

@Component({
  selector: 'app-classification',
  standalone: true,
  imports: [GeneralInfoPanelComponent, CreateSettlementPanelComponent],
  templateUrl: './classification.component.html',
  styleUrl: './classification.component.scss',
})
export class ClassificationComponent {}
