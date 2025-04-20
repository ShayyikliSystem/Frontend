import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../../../services/user.service';
import { User } from '../../dashboard-screen/transaction-filter/transaction-filter.component';
import { CheckbookService } from '../../../services/checkbook.service';
import { DigitalCheckService } from '../../../services/digital-check.service';
import { LoadingService } from '../../../services/loading.service';
import { CheckRefreshService } from '../../../services/check-refresh.service';
import { MatIconModule } from '@angular/material/icon';
import { Observable, startWith, map } from 'rxjs';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-request-issue-check-form',
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
  templateUrl: './request-issue-check-form.component.html',
  styleUrl: './request-issue-check-form.component.scss',
})
export class RequestIssueCheckFormComponent implements OnInit {
  @Output() applyFilter = new EventEmitter<any>();
  @Output() cancelFilter = new EventEmitter<void>();
 





  allUsers: User[] = [];
  filteredBeneficiaries: User[] = [];
  selectedBeneficiary: User | null = null;
  beneficiaryControl = new FormControl<string | User>('', Validators.required);
  checkNumber = '';
  amount: number | null = null;
  transferDate: Date | null = null;
  minDate: Date;

  constructor(
    private userService: UserService,
    private checkbookService: CheckbookService,
    private digitalCheckService: DigitalCheckService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.loadingService.loadingOn();
    this.userService.getAllUsersExcludingSelf().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
        this.filteredBeneficiaries = data;
        setTimeout(() => this.loadingService.loadingOff(), 400);
      },
      error: () => setTimeout(() => this.loadingService.loadingOff(), 400),
    });

    this.loadingService.loadingOn();
    this.checkbookService.getRandomInactiveCheck().subscribe({
      next: (data: any) => {
        this.checkNumber = data;
        setTimeout(() => this.loadingService.loadingOff(), 400);
      },
      error: () => setTimeout(() => this.loadingService.loadingOff(), 400),
    });

    this.beneficiaryControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.filteredBeneficiaries = this.filterUsers(value);
        this.selectedBeneficiary = null;
      } else {
        this.selectedBeneficiary = value;
      }
    });
  }

  private filterUsers(search: string): User[] {
    if (!search) return this.allUsers;
    const term = search.toLowerCase();
    return this.allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.shayyikliAccountNumber.toString().includes(term) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
    );
  }

  displayBeneficiary(user: User): string {
    return user
      ? `${user.firstName} ${user.lastName} (${user.shayyikliAccountNumber})`
      : '';
  }

  clearBeneficiary(): void {
    this.beneficiaryControl.setValue('');
    this.selectedBeneficiary = null;
    this.filteredBeneficiaries = this.allUsers;
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  validateDate(): void {
    if (this.transferDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sel = new Date(this.transferDate);
      sel.setHours(0, 0, 0, 0);
      if (sel <= today) this.transferDate = null;
    }
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sel = new Date(control.value);
      sel.setHours(0, 0, 0, 0);
      return sel <= today ? { futureDate: true } : null;
    };
  }

  onSubmit(form: NgForm): void {
    if (this.transferDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sel = new Date(this.transferDate);
      sel.setHours(0, 0, 0, 0);
      if (sel <= today) {
        form.controls['transferDate'].setErrors({ futureDate: true });
        return;
      }
    }
    

    if (form.invalid || !this.selectedBeneficiary) {
      Object.values(form.controls).forEach((c) => c.markAsTouched());
      if (!this.selectedBeneficiary) {
        this.beneficiaryControl.markAsTouched();
      }
      this.loadingService.loadingOff();
      return;
    }

    const newCheckRequest = {
      checkId: this.checkNumber,
      shyyiklinumberOfBeneficiary:
        this.selectedBeneficiary.shayyikliAccountNumber,
      amount: this.amount!.toString(),
      transferDate: this.formatDate(this.transferDate!),
    };

    this.loadingService.loadingOn();
    this.digitalCheckService.createDigitalCheck(newCheckRequest).subscribe({
      next: (response) => {
        this.applyFilter.emit(response);
        this.checkRefreshService.refreshTables();
        setTimeout(() => this.loadingService.loadingOff(), 400);
      },
      error: () => setTimeout(() => this.loadingService.loadingOff(), 400),
    });
  }

  onCancel(): void {
    this.cancelFilter.emit();
  }

 
allowOnlyIntegers(event: KeyboardEvent) {
  const char = event.key;
  const isDigit = /^[0-9]$/.test(char);
  const input = event.target as HTMLInputElement;


  if (!isDigit) {
    event.preventDefault();
    return;
  }

  if (input.value.length >= 6) {
    event.preventDefault();
  }
}

}
