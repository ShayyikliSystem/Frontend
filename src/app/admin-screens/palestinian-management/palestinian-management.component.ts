import { AdminService } from './../../services/admin.service';
import { LoadingService } from './../../services/loading.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { UserService } from '../../services/user.service';
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
import { User } from '../../models/user.model';
import { IssuedChecksPerUserComponent } from './issued-checks-per-user/issued-checks-per-user.component';
import { GeneralInfoPerUserComponent } from './general-info-per-user/general-info-per-user.component';
import { MatChipsModule } from '@angular/material/chips';
import { CheckbookHistoryPerUserComponent } from './checkbook-history-per-user/checkbook-history-per-user.component';
import { ReceivedChecksPerUserComponent } from './received-checks-per-user/received-checks-per-user.component';
import { ReturnedChecksPerUserComponent } from './returned-checks-per-user/returned-checks-per-user.component';
import { SettleChecksPerUserComponent } from './settle-checks-per-user/settle-checks-per-user.component';
import { OutcomingChecksPerUserComponent } from './outcoming-checks-per-user/outcoming-checks-per-user.component';
import { IncomingChecksPerUserComponent } from './incoming-checks-per-user/incoming-checks-per-user.component';
import { SettlementHistoryPerUserComponent } from './settlement-history-per-user/settlement-history-per-user.component';
import { TransactionPerUserComponent } from './transaction-per-user/transaction-per-user.component';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-palestinian-management',
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
    GeneralInfoPerUserComponent,
    IssuedChecksPerUserComponent,
    CheckbookHistoryPerUserComponent,
    MatChipsModule,
    ReceivedChecksPerUserComponent,
    ReturnedChecksPerUserComponent,
    SettleChecksPerUserComponent,
    OutcomingChecksPerUserComponent,
    IncomingChecksPerUserComponent,
    SettlementHistoryPerUserComponent,
    TransactionPerUserComponent,
    AlertComponent,
  ],
  templateUrl: './palestinian-management.component.html',
  styleUrl: './palestinian-management.component.scss',
})
export class PalestinianManagementComponent implements OnInit {
  @Output() selectedAccount = new EventEmitter<number>();

  allUsers: User[] = [];
  filteredUsers: User[] = [];
  userSearchCtrl = new FormControl<string | User | null>('');
  selectedAccountNumber?: number;
  selectedUser?: User;

  managementTabs = [
    { label: 'General Information', value: 'general' },
    { label: 'Checkbook Management', value: 'checkbook' },
    { label: 'Check Management', value: 'checks' },
    { label: 'Endorsement Management', value: 'endorsement' },
    { label: 'Settlement Management', value: 'classification' },
    { label: 'Transaction', value: 'transaction' },
  ];

  activeView: string = 'general';

  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
        this.filteredUsers = data;

        if (this.allUsers.length > 0) {
          const randomIndex = Math.floor(Math.random() * this.allUsers.length);
          const randomUser = this.allUsers[randomIndex];
          this.onUserSelected({
            option: {
              value: randomUser,
            },
          } as MatAutocompleteSelectedEvent);
        }
        this.loadingService.loadingOn();
      },
      error: (err) => console.error('Error fetching users', err),
    });

    this.userSearchCtrl.valueChanges.subscribe((searchTerm) => {
      if (typeof searchTerm === 'string') {
        this.filteredUsers = this.filterUsers(searchTerm, this.allUsers);
      } else if (searchTerm === null) {
        this.filteredUsers = this.allUsers;
      }
    });
    setTimeout(() => {
      this.loadingService.loadingOff();
    }, 400);
  }

  onChipSelectionChange(event: any) {
    this.activeView = event.value;
  }

  onUserSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedUser = event.option.value as User;
    this.selectedUser = selectedUser;
    this.selectedAccountNumber = selectedUser.shayyikliAccountNumber;
    this.userSearchCtrl.setValue(selectedUser); // Store User object directly
    this.selectedAccount.emit(this.selectedAccountNumber);
  }

  clearSelection(): void {
    this.selectedAccountNumber = undefined;
    this.selectedUser = undefined;
    this.userSearchCtrl.setValue('');
    this.filteredUsers = this.allUsers;
    this.selectedAccount.emit(undefined);
  }

  displayUser(user: User | string | null): string {
    if (!user) return '';
    if (typeof user === 'string') return user;
    return `${user.firstName} ${user.lastName} (${user.shayyikliAccountNumber})`;
  }

  private filterUsers(search: string, users: User[]): User[] {
    if (!search) return users;
    const lowerSearch = search.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerSearch) ||
        user.lastName.toLowerCase().includes(lowerSearch) ||
        user.shayyikliAccountNumber.toString().includes(lowerSearch)
    );
  }

  onGeneratePdf(): void {
    if (!this.selectedAccountNumber) {
      return;
    }
    this.alertVisible = false;
    this.loadingService.loadingOn();

    this.adminService
      .generateUserReportPdf(this.selectedAccountNumber)
      .subscribe({
        next: (data: ArrayBuffer) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `user-summary-${this.selectedAccountNumber}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
          this.alertType = 'success';
          this.alertMessage = 'PDF downloaded successfully.';
          this.alertVisible = true;
        },
        error: (err) => {
          console.error('Error generating PDF', err);
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
          this.alertType = 'error';
          this.alertMessage = 'Failed to download PDF, Please try again.';
          this.alertVisible = true;
        },
      });
  }
}
