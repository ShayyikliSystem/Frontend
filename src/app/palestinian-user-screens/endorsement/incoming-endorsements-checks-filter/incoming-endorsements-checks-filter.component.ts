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
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-incoming-endorsements-checks-filter',
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
  templateUrl: './incoming-endorsements-checks-filter.component.html',
  styleUrl: './incoming-endorsements-checks-filter.component.scss',
})
export class IncomingEndorsementsChecksFilterComponent implements OnInit {
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
  filteredEndorsers: User[] = [];

  issuerSearchCtrl = new FormControl('');
  endorserSearchCtrl = new FormControl('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.filteredIssuers = data;
        this.filteredEndorsers = data;
      },
      error: (err) => console.error(err),
    });

    this.issuerSearchCtrl.valueChanges.subscribe((val) =>
      this._filterList(val, 'issuer')
    );
    this.endorserSearchCtrl.valueChanges.subscribe((val) =>
      this._filterList(val, 'endorser')
    );
  }

  private _filterList(
    value: string | User | null,
    field: 'issuer' | 'endorser'
  ) {
    const listName =
      field === 'issuer' ? 'filteredIssuers' : 'filteredEndorsers';
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

  onEndorserSelected(event: MatAutocompleteSelectedEvent) {
    const u = event.option.value as User;
    this.filter.endorser = `${u.firstName} ${u.lastName}`;
  }
  clearEndorser() {
    this.filter.endorser = null;
    this.endorserSearchCtrl.setValue('');
    this.filteredEndorsers = this.allUsers;
  }

  openIssuerPanel() {
    this.issuerSearchCtrl.setValue('');
    this.filteredIssuers = this.allUsers;
  }
  openEndorserPanel() {
    this.endorserSearchCtrl.setValue('');
    this.filteredEndorsers = this.allUsers;
  }

  onSubmit() {
    this.applyFilter.emit(this.filter);
  }
  onCancel() {
    this.cancelFilter.emit();
  }
}
