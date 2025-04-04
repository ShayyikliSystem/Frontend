import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-classification-per-user',
  standalone: true,
  imports: [],
  templateUrl: './classification-per-user.component.html',
  styleUrl: './classification-per-user.component.css',
})
export class ClassificationPerUserComponent {
  classification: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserClassification().subscribe({
      next: (data: string) => {
        this.classification = data;
      },
      error: (err) => {
        console.error('Error fetching classification:', err);
        this.classification = 'N/A';
      },
    });
  }
}
