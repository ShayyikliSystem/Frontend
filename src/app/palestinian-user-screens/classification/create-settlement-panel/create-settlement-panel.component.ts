import { Component, OnInit } from '@angular/core';
import { CheckbookService } from '../../../services/checkbook.service';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
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
export class CreateSettlementPanelComponent implements OnInit {
  classification: any = 'N/A';

  isSettlementActive = false;
  showSettlementForm = false;

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

  openSettlementForm() {
    this.showSettlementForm = true;
  }

  closeSettlementForm() {
    this.showSettlementForm = false;
  }

  onSettlementCompleted() {
    this.showSettlementForm = false;
    this.checkSettlementStatus();
  }

  checkSettlementStatus() {
    /* … your existing code … */
  }
}
