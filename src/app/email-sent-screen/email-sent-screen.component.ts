import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-email-sent-screen',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './email-sent-screen.component.html',
  styleUrl: './email-sent-screen.component.scss',
})
export class EmailSentScreenComponent {
  resetEmail: string = '';

  constructor() {
    this.resetEmail = localStorage.getItem('resetEmail') || '';
  }
}
