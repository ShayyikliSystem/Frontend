import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss',
})
export class TermsConditionsComponent implements AfterViewInit {
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
