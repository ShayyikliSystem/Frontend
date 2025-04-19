import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { CheckRefreshService } from '../../../services/check-refresh.service';
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
  beneficiaryControl = new FormControl<string | User>('');
  selectedBeneficiary: User | null = null;

  endorseCheck?: DigitalCheck;
  checkNumber = '';
  amount: number | null = null;
  transferDate: Date | null = null;

  constructor(
    private userService: UserService,
    private digitalCheckService: DigitalCheckService,
    private loadingService: LoadingService,
    private checkRefreshService: CheckRefreshService
  ) {}

  ngOnInit(): void {
    // this.loadingService.loadingOn();
    // this.userService.getAllUsersExcludingSelf().subscribe({
    //   next: (users) => {
    //     this.allUsers = users;
    //     this.filteredBeneficiaries = users;
    //     setTimeout(() => this.loadingService.loadingOff(), 400);
    //   },
    //   error: () => setTimeout(() => this.loadingService.loadingOff(), 400),
    // });

    // this.loadingService.loadingOn();
    // this.digitalCheckService.readCheck(this.checkId).subscribe({
    //   next: (chk) => {
    //     this.endorseCheck = chk;
    //     this.checkNumber = chk.checkId;
    //     this.amount = chk.amount;
    //     this.transferDate = new Date(chk.transferDate);
    //     setTimeout(() => this.loadingService.loadingOff(), 400);
    //   },
    //   error: () => setTimeout(() => this.loadingService.loadingOff(), 400),
    // });
    this.digitalCheckService.readCheck(this.checkId).subscribe({
      next: (chk) => {
        this.endorseCheck  = chk;
        this.checkNumber   = chk.checkId;
        this.amount        = chk.amount;
        this.transferDate  = new Date(chk.transferDate);
  
     
        this.userService
          .getAllUsersExcludingBeneficiaryAndIssuer(
            chk.shyyiklinumberOfBeneficiary,   
            chk.shyyiklinumberOfUsers          
          )
          .subscribe({
            next: (users) => {
              this.allUsers = users;
              this.filteredBeneficiaries = users;
              setTimeout(() => this.loadingService.loadingOff(), 400);
            },
            error: () => setTimeout(() => this.loadingService.loadingOff(), 400),
          });
      },
      error: () => setTimeout(() => this.loadingService.loadingOff(), 400),
    });
    

    this.beneficiaryControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        const term = value.toLowerCase();
        this.filteredBeneficiaries = this.allUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(term) ||
            user.lastName.toLowerCase().includes(term) ||
            user.shayyikliAccountNumber.toString().includes(term) ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
        );
        this.selectedBeneficiary = null;
      } else {
        this.selectedBeneficiary = value;
      }
    });
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

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.selectedBeneficiary) {
      Object.values(form.controls).forEach((c) => c.markAsTouched());
      if (!this.selectedBeneficiary) {
        this.beneficiaryControl.markAsTouched();
      }
      this.loadingService.loadingOff();
      return;
    }

    this.loadingService.loadingOn();
    this.digitalCheckService
      .endorseCheck(this.checkId, {
        newBeneficiary:
          this.selectedBeneficiary.shayyikliAccountNumber.toString(),
      })
      .subscribe({
        next: (res) => {
          this.applyFilter.emit(res);
          this.checkRefreshService.refreshTables();
          setTimeout(() => this.loadingService.loadingOff(), 400);
        },
        error: () => setTimeout(() => this.loadingService.loadingOff(), 400),
      });
  }

  onCancel(): void {
    this.closeForm.emit();
  }
}
