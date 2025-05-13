import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoadingService } from '../../../services/loading.service';
import {
  SupportService,
  SupportRequest,
} from '../../../services/support.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CheckRefreshService } from '../../../services/check-refresh.service';

@Component({
  selector: 'app-support-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './support-form.component.html',
  styleUrl: './support-form.component.scss',
})
export class SupportFormComponent {
  supportForm: FormGroup;
  submitted = false;

  @Output() alertMessageEvent = new EventEmitter<{
    message: string;
    type: 'success' | 'error';
  }>();

  supportAreas: string[] = [
    'CHECKBOOK',
    'CHECK',
    'ENDORSMENT',
    'SETTLEMENT',
    'GENERAL_SETTING',
  ];

  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {
    this.supportForm = this.fb.group({
      supportArea: ['', Validators.required],
      supportDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.submitted = true;
    this.loadingService.loadingOn();
    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();

      this.supportForm.markAsDirty();

      setTimeout(() => this.loadingService.loadingOff(), 400);
      return;
    }

    const formValue: SupportRequest = this.supportForm.value;
    this.supportService.createSupportRequest(formValue).subscribe({
      next: (response) => {
        this.supportForm.reset();
        Object.keys(this.supportForm.controls).forEach((key) => {
          const control = this.supportForm.get(key);
          control?.setErrors(null);
          control?.markAsPristine();
          control?.markAsUntouched();
        });
        this.showAlert(
          'Your support request has been submitted successfully.',
          'success'
        );
        this.submitted = false;

        this.checkRefreshService.refreshTables();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error submitting support request:', error);
        this.showAlert(
          'Error submitting support request, Please try again later.',
          'error'
        );
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    this.alertMessageEvent.emit({ message, type });
  }

  transformEnumValue(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }
}
