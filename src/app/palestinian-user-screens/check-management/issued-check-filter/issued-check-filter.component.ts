import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
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
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-issued-check-filter',
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
  templateUrl: './issued-check-filter.component.html',
  styleUrl: './issued-check-filter.component.scss',
})
export class IssuedCheckFilterComponent implements OnInit {
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

  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  filter = { ...this.currentFilter };
  allUsers: User[] = [];
  filteredBeneficiaries: User[] = [];
  beneficiarySearchCtrl = new FormControl('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
        this.filteredBeneficiaries = data;
      },
      error: (err) => console.error('Error fetching all users', err),
    });

    this.beneficiarySearchCtrl.valueChanges.subscribe(
      (searchTerm: string | User | null) => {
        if (typeof searchTerm === 'string') {
          this.filteredBeneficiaries = this.filterUsers(
            searchTerm,
            this.allUsers
          );
        } else if (searchTerm === null) {
          this.filteredBeneficiaries = this.allUsers;
        }
      }
    );
  }

  displayBeneficiary(user: User): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  onBeneficiarySelected(event: MatAutocompleteSelectedEvent): void {
    const selectedUser = event.option.value as User;
    this.filter.beneficiary = `${selectedUser.firstName} ${selectedUser.lastName}`;
  }

  openBeneficiaryPanel(): void {
    this.beneficiarySearchCtrl.setValue('');
    this.filteredBeneficiaries = this.allUsers;
  }

  clearBeneficiary(): void {
    this.filter.beneficiary = null;
    this.beneficiarySearchCtrl.setValue('');
    this.filteredBeneficiaries = this.allUsers;
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
