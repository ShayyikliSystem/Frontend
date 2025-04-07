import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CheckbookService } from '../../../services/checkbook.service';
import { UserService } from '../../../services/user.service';
import { RequestCheckbookComponent } from '../request-checkbook/request-checkbook.component';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-checkbook-info-panel',
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
    RequestCheckbookComponent,
  ],
  templateUrl: './checkbook-info-panel.component.html',
  styleUrl: './checkbook-info-panel.component.scss',
})
export class CheckbookInfoPanelComponent implements OnInit {
  returnedchecks: any = 'N/A';
  totalChecks: any = 'N/A';
  ramainingChecks: any = 'N/A';
  classification: any = 'N/A';
  checkbookId: string = 'N/A';
  hasActiveCheckbook: boolean = false;
  showRequestCheckbookOverlay: boolean = false;

  constructor(
    private userService: UserService,
    private checkbookService: CheckbookService,
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

  loadCheckbookData(): void {
    this.loadingService.loadingOn();

    this.checkbookService.hasActiveCheckbook().subscribe({
      next: (data) => {
        this.hasActiveCheckbook = data;
        if (this.hasActiveCheckbook) {
          this.checkbookService.getCheckbookForCurrentUser().subscribe({
            next: (checkbookdata) => {
              this.checkbookId = checkbookdata.checkbook.checkbookid;
              this.returnedchecks = checkbookdata.checkbook.returnedchecks;
              this.totalChecks = checkbookdata.totalChecks;
              this.ramainingChecks = checkbookdata.checkbook.remainingChecks;
              setTimeout(() => {
                this.loadingService.loadingOff();
              }, 400);
            },
            error: (err) => {
              console.error('Error fetching checkbook details', err);
              setTimeout(() => {
                this.loadingService.loadingOff();
              }, 400);
            },
          });
        } else {
          setTimeout(() => {
            this.loadingService.loadingOff();
          }, 400);
        }
      },
      error: (err) => {
        console.error('Error fetching active checkbook status', err);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadCheckbookData();
  }

  openRequestCheckbook(): void {
    this.showRequestCheckbookOverlay = true;
  }

  cancelRequestCheckbook(): void {
    this.showRequestCheckbookOverlay = false;
  }

  handleRequestCheckbook(): void {
    this.loadingService.loadingOn();

    this.checkbookService.requestCheckbook().subscribe({
      next: (response) => {
        this.showRequestCheckbookOverlay = false;

        this.loadingService.loadingOn();
        this.checkbookService.getCheckbookForCurrentUser().subscribe({
          next: (data) => {
            this.checkbookId = data.id;
            setTimeout(() => {
              this.loadingService.loadingOff();
            }, 400);
          },
          error: (err) => {
            console.error('Error updating checkbook info', err);
            setTimeout(() => {
              this.loadingService.loadingOff();
            }, 400);
          },
        });

        this.loadingService.loadingOn();
        this.checkbookService.hasActiveCheckbook().subscribe({
          next: (data) => {
            this.hasActiveCheckbook = data;
            setTimeout(() => {
              this.loadingService.loadingOff();
            }, 400);
          },
          error: (err) => {
            console.error('Error updating active checkbook status', err);
            setTimeout(() => {
              this.loadingService.loadingOff();
            }, 400);
          },
        });

        this.loadCheckbookData();

        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
      error: (error) => {
        console.error('Error requesting checkbook', error);
        setTimeout(() => {
          this.loadingService.loadingOff();
        }, 400);
      },
    });

    this.loadCheckbookData();
  }
}
