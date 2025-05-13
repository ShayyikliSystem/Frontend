import { LoadingService } from './../../../services/loading.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reply-per-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reply-per-user.component.html',
  styleUrl: './reply-per-user.component.scss',
})
export class ReplyPerUserComponent {
  @Input() supportId!: number;
  @Input() description = '';

  @Output() closed = new EventEmitter<void>();
  @Output() replied = new EventEmitter<void>();

  adminMessage = '';
  loading = false;
  error: string | null = null;

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService
  ) {}

  sendReply(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.error = null;
    this.loadingService.loadingOn();
    this.loading = true;

    this.adminService
      .replyToSupportMessage(this.supportId, this.adminMessage.trim())
      .subscribe({
        next: () => {
          this.loading = false;
          this.loadingService.loadingOff();
          this.replied.emit();
        },
        error: (err) => {
          this.loading = false;
          this.loadingService.loadingOff();
          this.error = err?.message || 'Failed to send reply.';
        },
      });
  }

  cancel() {
    this.closed.emit();
  }
}
