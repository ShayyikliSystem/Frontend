import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/signup']);
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('.smooth-scroll').forEach((anchor) => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const targetId = (e.target as HTMLAnchorElement)
          .getAttribute('href')
          ?.substring(1);
        const targetElement = document.getElementById(targetId!);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}
