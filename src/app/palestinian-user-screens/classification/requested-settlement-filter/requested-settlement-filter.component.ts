import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-requested-settlement-filter',
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
  templateUrl: './requested-settlement-filter.component.html',
  styleUrl: './requested-settlement-filter.component.scss',
})
export class RequestedSettlementFilterComponent implements OnInit {
  @Input() filter: { status: string; initiator: string; date: Date | null } = {
    status: '',
    initiator: '',
    date: null,
  };

  @Output() applyFilter = new EventEmitter<any>();
  @Output() cancelFilter = new EventEmitter<void>();

  beneficiaryCtrl = new FormControl('');

  allUsers: User[] = [];
  filteredInitiators: User[] = [];
  initiatorSearchCtrl = new FormControl('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsersExcludingSelf().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
        this.filteredInitiators = data;
      },
      error: (err) => console.error('Error fetching users', err),
    });

    this.initiatorSearchCtrl.valueChanges.subscribe(
      (val: string | User | null) => {
        if (typeof val === 'string') {
          this.filteredInitiators = this.filterUsers(val, this.allUsers);
        } else if (val === null) {
          this.filteredInitiators = this.allUsers;
        }
      }
    );
  }

  displayInitiator(user: User): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  onInitiatorSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as User;
    this.filter.initiator = `${selected.firstName} ${selected.lastName}`;
  }

  openInitiatorPanel(): void {
    this.initiatorSearchCtrl.setValue('');
    this.filteredInitiators = this.allUsers;
  }

  clearInitiator(): void {
    this.filter.initiator = '';
    this.initiatorSearchCtrl.setValue('');
    this.filteredInitiators = this.allUsers;
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

  clearField(field: 'status' | 'initiator' | 'date') {
    if (field === 'date') {
      this.filter.date = null;
    } else {
      this.filter[field] = '';
    }
  }
}
