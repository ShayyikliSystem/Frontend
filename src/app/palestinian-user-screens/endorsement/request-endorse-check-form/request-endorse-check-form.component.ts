import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { CheckRefreshService } from '../../../services/check-refresh.service';
import { CheckbookService } from '../../../services/checkbook.service';
import { DigitalCheckService } from '../../../services/digital-check.service';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../dashboard-screen/transaction-filter/transaction-filter.component';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DigitalCheck } from '../../../models/digital.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-request-endorse-check-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  templateUrl: './request-endorse-check-form.component.html',
  styleUrl: './request-endorse-check-form.component.scss',
})
export class RequestEndorseCheckFormComponent implements OnInit {
  @Input() checkId!: string;
  @Output() applyFilter = new EventEmitter<any>();
  @Output() cancelFilter = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  allUsers: User[] = [];
  filteredBeneficiaries: User[] = [];
  beneficiaryInput: string = '';
  selectedBeneficiary: User | null = null;
  checkNumber: string = '';
  amount: number | null = null;
  transferDate: Date | null = null;
  endorseCheck: DigitalCheck | undefined;

  constructor(
    private userService: UserService,
    private checkbookService: CheckbookService,
    private digitalCheckService: DigitalCheckService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {}

  ngOnInit(): void {
    this.loadingService.loadingOn();
    this.userService.getAllUsersExcludingSelf().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
        this.filteredBeneficiaries = data;
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (err) => {
        console.error('Error fetching all users', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });

    this.loadingService.loadingOn();
    this.digitalCheckService.readCheck(this.checkId).subscribe({
      next: (response) => {
        this.endorseCheck = response;
        this.checkNumber = response.checkId;
        this.amount = response.amount;
        this.transferDate = new Date(response.transferDate);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching digital check:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  private filterUsers(search: string): User[] {
    if (!search) {
      return this.allUsers;
    }
    const lowerSearch = search.toLowerCase();
    return this.allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerSearch) ||
        user.lastName.toLowerCase().includes(lowerSearch) ||
        user.shayyikliAccountNumber.toString().toLowerCase().includes(lowerSearch) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowerSearch)
    );
  }

  onBeneficiaryInput(): void {
    this.filteredBeneficiaries = this.filterUsers(this.beneficiaryInput);
    
    // Try to find an exact match
    const exactMatch = this.allUsers.find(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase() === this.beneficiaryInput.toLowerCase() ||
      user.shayyikliAccountNumber.toString() === this.beneficiaryInput
    );
    
    this.selectedBeneficiary = exactMatch || null;
  }

  displayBeneficiary(user: User): string {
    return user ? `${user.firstName} ${user.lastName} (${user.shayyikliAccountNumber})` : '';
  }

  clearBeneficiary(): void {
    this.beneficiaryInput = '';
    this.selectedBeneficiary = null;
    this.filteredBeneficiaries = this.allUsers;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.selectedBeneficiary) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      if (!this.selectedBeneficiary) {
        form.controls['beneficiary'].setErrors({ required: true });
      }
      this.loadingService.loadingOff();
      return;
    }

    this.loadingService.loadingOn();
    this.digitalCheckService
      .endorseCheck(this.checkId, {
        newBeneficiary: this.selectedBeneficiary.shayyikliAccountNumber.toString(),
      })
      .subscribe({
        next: (response) => {
          this.applyFilter.emit(response);
          this.checkRefreshService.refreshTables();
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
        error: (error) => {
          console.error('Error endorsing check:', error);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        },
      });
  }

  onCancel(): void {
    this.closeForm.emit();
  }
}