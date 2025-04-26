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
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-outcoming-endorsements-checks-filter',
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
  templateUrl: './outcoming-endorsements-checks-filter.component.html',
  styleUrl: './outcoming-endorsements-checks-filter.component.scss',
})
export class OutcomingEndorsementsChecksFilterComponent implements OnInit {
  @Input() currentFilter: any = {
    date: null,
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
  filteredIssuers: User[] = [];
  filteredBeneficiaries: User[] = [];

  issuerSearchCtrl = new FormControl('');
  beneficiarySearchCtrl = new FormControl('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsersExcludingSelf().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.filteredIssuers = data;
        this.filteredBeneficiaries = data;
      },
      error: (err) => console.error(err),
    });

    this.issuerSearchCtrl.valueChanges.subscribe((val) =>
      this._filterList(val, 'issuer')
    );
    this.beneficiarySearchCtrl.valueChanges.subscribe((val) =>
      this._filterList(val, 'beneficiary')
    );
  }

  private _filterList(
    value: string | User | null,
    field: 'issuer' | 'beneficiary'
  ) {
    const listName =
      field === 'issuer' ? 'filteredIssuers' : 'filteredBeneficiaries';
    if (typeof value === 'string') {
      const term = value.toLowerCase();
      this[listName] = this.allUsers.filter(
        (u) =>
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.shayyikliAccountNumber.toString().includes(term)
      );
    } else {
      this[listName] = this.allUsers;
    }
  }

  displayUser(user: User): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  onIssuerSelected(event: MatAutocompleteSelectedEvent) {
    const u = event.option.value as User;
    this.filter.issuer = `${u.firstName} ${u.lastName}`;
  }
  clearIssuer() {
    this.filter.issuer = null;
    this.issuerSearchCtrl.setValue('');
    this.filteredIssuers = this.allUsers;
  }

  onBeneficiarySelected(event: MatAutocompleteSelectedEvent) {
    const u = event.option.value as User;
    this.filter.beneficiary = `${u.firstName} ${u.lastName}`;
  }
  clearBeneficiary() {
    this.filter.beneficiary = null;
    this.beneficiarySearchCtrl.setValue('');
    this.filteredBeneficiaries = this.allUsers;
  }

  openIssuerPanel() {
    this.issuerSearchCtrl.setValue('');
    this.filteredIssuers = this.allUsers;
  }
  openBeneficiaryPanel() {
    this.beneficiarySearchCtrl.setValue('');
    this.filteredBeneficiaries = this.allUsers;
  }

  onSubmit() {
    this.applyFilter.emit(this.filter);
  }
  onCancel() {
    this.cancelFilter.emit();
  }
}
