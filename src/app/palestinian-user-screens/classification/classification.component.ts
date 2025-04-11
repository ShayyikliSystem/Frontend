import { Component } from '@angular/core';
import { GeneralInfoPanelComponent } from '../dashboard-screen/general-info-panel/general-info-panel.component';

@Component({
  selector: 'app-classification',
  standalone: true,
  imports: [GeneralInfoPanelComponent],
  templateUrl: './classification.component.html',
  styleUrl: './classification.component.scss',
})
export class ClassificationComponent {}
