import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../alert/alert.component';
import { AuthService } from '../../services/auth.service';
import { ClassificationPerUserComponent } from './classification-per-user/classification-per-user.component';

@Component({
  selector: 'app-classification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AlertComponent,
    ClassificationPerUserComponent,
  ],
  templateUrl: './classification.component.html',
  styleUrl: './classification.component.css',
})
export class ClassificationComponent {
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => (this.alertMessage = ''), 5000);
  }

  constructor(private authService: AuthService) {}
}
