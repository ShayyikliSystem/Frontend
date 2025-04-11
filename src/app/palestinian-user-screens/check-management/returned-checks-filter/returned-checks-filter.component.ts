import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-returned-checks-filter',
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
  templateUrl: './returned-checks-filter.component.html',
  styleUrl: './returned-checks-filter.component.scss',
})
export class ReturnedChecksFilterComponent implements OnInit {
  @Input() currentFilter: any = {
    date: null,
    amount: null,
    status: '',
    issuer: null,
    beneficiary: null,
  };

  @Input() statusOptions: string[] = [];
  @Output() applyFilter = new EventEmitter<any>();
  @Output() cancelFilter = new EventEmitter<void>();

  filter = { ...this.currentFilter };

  allUsers: User[] = [];
  filteredIssuers: User[] = [];
  filteredBeneficiaries: User[] = [];

  issuerSearchCtrl = new FormControl('');
  beneficiarySearchCtrl = new FormControl('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsersExcludingSelf().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
        this.filteredIssuers = data;
        this.filteredBeneficiaries = data;
      },
      error: (err) => console.error('Error fetching all users', err),
    });

    this.issuerSearchCtrl.valueChanges.subscribe(
      (searchTerm: string | null) => {
        this.filteredIssuers = this.filterUsers(
          searchTerm || '',
          this.allUsers
        );
      }
    );

    this.beneficiarySearchCtrl.valueChanges.subscribe(
      (searchTerm: string | null) => {
        this.filteredBeneficiaries = this.filterUsers(
          searchTerm || '',
          this.allUsers
        );
      }
    );
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

  onSubmit(): void {
    this.applyFilter.emit(this.filter);
  }

  onCancel(): void {
    this.cancelFilter.emit();
  }
}
