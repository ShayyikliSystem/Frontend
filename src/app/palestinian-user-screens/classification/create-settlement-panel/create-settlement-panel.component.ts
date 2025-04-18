import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CheckbookService } from '../../../services/checkbook.service';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SettlementService } from '../../../services/settlement.service';
import { CreateSettlementFormComponent } from '../create-settlement-form/create-settlement-form.component';

@Component({
  selector: 'app-create-settlement-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    CreateSettlementFormComponent,
  ],
  templateUrl: './create-settlement-panel.component.html',
  styleUrl: './create-settlement-panel.component.scss',
})
export class CreateSettlementPanelComponent implements OnInit, AfterViewInit {
  classification: any = 'N/A';

  isSettlementActive = false;
  showSettlementForm = false;

  dynamicPageSizeOptions: number[] = [5, 10, 15, 20, 25];

  displayedColumns = [
    'checkId',
    'targetUserName',
    'transferDate',
    'amount',
    'status',
    'resettle',
  ];
  initiatorDetailsDataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) set sort(ms: MatSort) {
    this.initiatorDetailsDataSource.sort = ms;
    if (this.initiatorDetailsDataSource.paginator) {
      this.initiatorDetailsDataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this.initiatorDetailsDataSource.paginator = mp;
  }

  ngAfterViewInit(): void {
    this.initiatorDetailsDataSource.sort = this.sort;
    this.initiatorDetailsDataSource.paginator = this.paginator;
  }

  constructor(
    private settlementService: SettlementService,
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  loadUserData(): void {
    this.loadingService.loadingOn();

    this.userService.getUserClassification().subscribe({
      next: (data) => {
        this.classification = data;
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (err) => {
        console.error('Error fetching classification', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  ngOnInit(): void {
    this.loadUserData();

    this.loadingService.loadingOn();
    this.settlementService.isSettlementActive().subscribe({
      next: (res) => {
        this.isSettlementActive = res;
        if (this.isSettlementActive) {
          this.loadInitiatorDetails();
        }
        console.log('Settlement active status:', res);
      },
      error: (err) => {
        console.error('Failed to fetch settlement status', err);
      },
      complete: () => {
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  updatePageSizeOptions(): void {
    const count = this.initiatorDetailsDataSource.filteredData.length;

    if (count < 5) {
      this.dynamicPageSizeOptions = [count];
      return;
    }

    const options: number[] = [];
    for (let i = 5; i <= count; i += 5) {
      options.push(i);
    }

    if (options[options.length - 1] !== count) {
      options.push(count);
    }
    this.dynamicPageSizeOptions = options;
  }

  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.pageSize = this.dynamicPageSizeOptions[0];
    }
  }

  openSettlementForm() {
    this.showSettlementForm = true;
  }

  closeSettlementForm() {
    this.showSettlementForm = false;
  }

  onSettlementCompleted() {
    this.showSettlementForm = false;
    this.loadInitiatorDetails();
  }

  private loadInitiatorDetails(): void {
    this.loadingService.loadingOn();
    this.settlementService.getSettlementDetailsForInitiator().subscribe({
      next: (data: any[]) => {
        data.sort((a, b) => {
          const aRejected = a.status === 'Rejected';
          const bRejected = b.status === 'Rejected';
          if (aRejected && !bRejected) return -1;
          if (!aRejected && bRejected) return 1;
          return 0;
        });

        this.initiatorDetailsDataSource.data = data;

        this.updatePageSizeOptions();
        this.resetPaginator();
      },
      error: (err) => {
        console.error('Error fetching initiator settlement details', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      complete: () => {
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

  resettle(tx: any): void {
    this.loadingService.loadingOn();
    this.settlementService.resettle({ checkId: tx.checkId }).subscribe({
      next: () => {
        this.loadInitiatorDetails();
      },
      error: (err) => {
        console.error('Error resettling', err);
      },
      complete: () => {
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }
}
