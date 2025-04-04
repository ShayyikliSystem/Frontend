import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Input() duration: number = 5000;
  show = true;

  ngOnInit(): void {
    if (this.duration > 0) {
      setTimeout(() => this.closeAlert(), this.duration);
    }
  }

  closeAlert(): void {
    this.show = false;
  }
}
