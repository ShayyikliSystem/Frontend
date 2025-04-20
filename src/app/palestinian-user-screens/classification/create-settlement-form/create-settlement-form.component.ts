import { SettlementService } from './../../../services/settlement.service';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  DigitalCheckExtended,
  DigitalCheck,
} from '../../../models/digital.model';
import { DigitalCheckService } from '../../../services/digital-check.service';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-settlement-form',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './create-settlement-form.component.html',
  styleUrl: './create-settlement-form.component.scss',
})
export class CreateSettlementFormComponent implements OnInit, AfterViewInit {
  @Output() requestCompleted = new EventEmitter<void>();
  @Output() cancelRequest = new EventEmitter<void>();
  @Output() alertMessageEvent = new EventEmitter<{
    message: string;
    type: 'success' | 'error';
  }>();
  displayedColumns = [
    'checkId',
    'returnedDate',
    'beneficiaryName',
    'endorsersNames',
    'amount',
  ];
  returnedCheckDataSource = new MatTableDataSource<DigitalCheckExtended>();

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.returnedCheckDataSource.sort = ms;
    if (this.returnedCheckDataSource.paginator) {
      this.returnedCheckDataSource.paginator.firstPage();
    }
  }

  constructor(
    private settlementService: SettlementService,
    private loadingService: LoadingService,
    private digitalCheckService: DigitalCheckService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchReturnedChecks();
  }

  ngAfterViewInit(): void {
    this.returnedCheckDataSource.sort = this.sort;
  }

  fetchReturnedChecks(): void {
    this.loadingService.loadingOn();
    this.digitalCheckService.getReturnedChecksForUser().subscribe({
      next: (data: DigitalCheck[]) => {
        const returnedChecks: DigitalCheckExtended[] = data.map(
          (tx: DigitalCheck) => ({
            ...tx,
            transferDate: this.formatDate(tx.transferDate),
            rawTransferDate: tx.transferDate,
          })
        );

        returnedChecks.forEach((tx) => {
          this.loadingService.loadingOn();
          this.userService
            .getUserDetailsByAccountNumber(tx.shyyiklinumberOfUsers)
            .subscribe({
              next: (userData) => {
                tx.issuerName = `${userData.firstName} ${userData.lastName}`;
                setTimeout(() => {
                  this.loadingService.loadingOff();
                }, 400);
              },
              error: (err) => {
                console.error('Error fetching issuer details', err);
                tx.issuerName = 'N/A';
                setTimeout(() => {
                  this.loadingService.loadingOff();
                }, 400);
              },
            });

          this.loadingService.loadingOn();
          this.userService
            .getUserDetailsByAccountNumber(tx.shyyiklinumberOfBeneficiary)
            .subscribe({
              next: (userData) => {
                tx.beneficiaryName = `${userData.firstName} ${userData.lastName}`;
                setTimeout(() => {
                  this.loadingService.loadingOff();
                }, 400);
              },
              error: (err) => {
                console.error('Error fetching beneficiary details', err);
                tx.beneficiaryName = 'N/A';
                setTimeout(() => {
                  this.loadingService.loadingOff();
                }, 400);
              },
            });
        });

        returnedChecks.sort(
          (a, b) =>
            new Date(b.rawTransferDate).getTime() -
            new Date(a.rawTransferDate).getTime()
        );
        this.returnedCheckDataSource.data = returnedChecks;
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error fetching recent returnedChecks:', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  formatDate(dateString: string): string {
    const dt = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(dt);
  }

  requestSettlement(): void {
    this.loadingService.loadingOn();
    this.settlementService.submitSettlement().subscribe({
      next: () => {
        this.showAlert('Settlement submitted successfully!', 'success');
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
        this.requestCompleted.emit();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Settlement failed:', err.error);
        this.showAlert('Failed to submit settlement. Please try again.', 'error');
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  cancel(): void {
    this.cancelRequest.emit();
  }

  showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    this.alertMessageEvent.emit({ message, type });
  }
}
