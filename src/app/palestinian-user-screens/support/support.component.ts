import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupportService, SupportRequest } from '../../services/support.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
})
export class SupportComponent {
  supportForm: FormGroup;
  submitted = false;

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
    private snackBar: MatSnackBar
  ) {
    this.supportForm = this.fb.group({
      supportArea: ['', Validators.required],
      supportDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.submitted = true;
    if (this.supportForm.invalid) {
      return;
    }

    const formValue: SupportRequest = this.supportForm.value;
    this.supportService.createSupportRequest(formValue).subscribe({
      next: (response) => {
        this.snackBar.open('Support request submitted successfully!', 'Close', {
          duration: 3000,
        });
        this.supportForm.reset();
        Object.keys(this.supportForm.controls).forEach((key) => {
          const control = this.supportForm.get(key);
          control?.setErrors(null);
          control?.markAsPristine();
          control?.markAsUntouched();
        });
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error submitting support request:', error);
        this.snackBar.open(
          'Failed to submit support request. Please try again.',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }
}
