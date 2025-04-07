import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingComponentComponent } from './loading-component/loading-component.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, LoadingComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Shayyikli-System';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.validateToken().subscribe({
      next: (res) => {
        console.log('Token validation successful:', res);
      },
      error: (err) => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRoles');
        sessionStorage.clear();
      },
    });
  }
}
