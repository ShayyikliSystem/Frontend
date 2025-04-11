import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
  beneficiarySearchCtrl = new FormControl('');
  selectedBeneficiary: User | null = null;
  checkNumber: string = '';
  amount: number | null = null;
  transferDate: Date | null = null;

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

    this.beneficiarySearchCtrl.valueChanges.subscribe(
      (searchTerm: string | null) => {
        this.filteredBeneficiaries = this.filterUsers(
          searchTerm || '',
          this.allUsers
        );
      }
    );

    this.loadingService.loadingOn();
    this.checkbookService.getRandomInactiveCheck().subscribe({
      next: (data: any) => {
        this.checkNumber = data;
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching random check number', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  filterUsers(search: string, users: User[]): User[] {
    if (!search) {
      return users;
    }
    const lowerSearch = search.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerSearch) ||
        user.lastName.toLowerCase().includes(lowerSearch) ||
        user.shayyikliAccountNumber
          .toString()
          .toLowerCase()
          .includes(lowerSearch)
    );
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) =>
        control.markAsTouched()
      );
      this.loadingService.loadingOff();
      return;
    }

    const newCheckRequest = {
      checkId: this.checkNumber,
      shyyiklinumberOfBeneficiary:
        this.selectedBeneficiary!.shayyikliAccountNumber,
      amount: this.amount!.toString(),
      transferDate: this.formatDate(this.transferDate!),
    };

    this.loadingService.loadingOn();
    this.digitalCheckService.createDigitalCheck(newCheckRequest).subscribe({
      next: (response) => {
        this.applyFilter.emit(response);
        this.checkRefreshService.refreshTables();
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error creating digital check:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  onCancel(): void {
    this.cancelFilter.emit();
  }
}
