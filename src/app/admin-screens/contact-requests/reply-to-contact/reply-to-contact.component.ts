import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../../services/admin.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-reply-to-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reply-to-contact.component.html',
  styleUrl: './reply-to-contact.component.scss',
})
export class ReplyToContactComponent {
  @Input() contactId!: number;
  @Input() message = '';

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
      .replyToContactMessage(this.contactId, this.adminMessage.trim())
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
