import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../dashboard-screen/transaction-filter/transaction-filter.component';
import { UserService } from '../../../services/user.service';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';

@Component({
  selector: 'app-current-settlement-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  templateUrl: './current-settlement-filter.component.html',
  styleUrl: './current-settlement-filter.component.scss',
})
export class CurrentSettlementFilterComponent implements OnInit {
  @Input() filter: { status: string; beneficiary: string; date: Date | null } =
    {
      status: '',
      beneficiary: '',
      date: null,
    };

  @Output() applyFilter = new EventEmitter<any>();
  @Output() cancelFilter = new EventEmitter<void>();

  beneficiaryCtrl = new FormControl('');

  allUsers: User[] = [];
  filteredBeneficiaries: User[] = [];
  beneficiarySearchCtrl = new FormControl('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsersExcludingSelf().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
        this.filteredBeneficiaries = data;
      },
      error: (err) => console.error('Error fetching users', err),
    });

    this.beneficiarySearchCtrl.valueChanges.subscribe(
      (val: string | User | null) => {
        if (typeof val === 'string') {
          this.filteredBeneficiaries = this.filterUsers(val, this.allUsers);
        } else if (val === null) {
          this.filteredBeneficiaries = this.allUsers;
        }
      }
    );
  }

  displayBeneficiary(user: User): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  onBeneficiarySelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as User;
    this.filter.beneficiary = `${selected.firstName} ${selected.lastName}`;
  }

  openBeneficiaryPanel(): void {
    this.beneficiarySearchCtrl.setValue('');
    this.filteredBeneficiaries = this.allUsers;
  }

  clearBeneficiary(): void {
    this.filter.beneficiary = '';
    this.beneficiarySearchCtrl.setValue('');
    this.filteredBeneficiaries = this.allUsers;
  }

  filterUsers(search: string, users: User[]): User[] {
    const lowerSearch = search.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerSearch) ||
        user.lastName.toLowerCase().includes(lowerSearch) ||
        user.shayyikliAccountNumber.toString().includes(lowerSearch)
    );
  }

  onSubmit() {
    this.applyFilter.emit(this.filter);
  }

  onCancel() {
    this.cancelFilter.emit();
  }

  clearField(field: 'status' | 'beneficiary' | 'date') {
    if (field === 'date') {
      this.filter.date = null;
    } else {
      this.filter[field] = '';
    }
  }
}
