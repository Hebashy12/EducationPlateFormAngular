import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { AuthService, User } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,         // ✅ Needed for *ngIf, *ngFor
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showHeader = false;
  auth = inject(AuthService);

  constructor(private router: Router) {
    // ✅ Show header only on /courses or child routes of /courses
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showHeader = event.urlAfterRedirects === '/courses';
      });
  }

  ngOnInit(): void {
    this.auth.refreshToken().subscribe({
      next: (data) => {
        const token = data.accessToken;
        const decodedToken = jwtDecode<{ user: Omit<User, 'token'> }>(token);

        const user: User = { ...decodedToken.user, token };
        this.auth.userSignal.set(user);
      },
      error: (err) => {
        console.log("Refresh error from AppComponent:", err);
        this.auth.userSignal.set(null);
      }
    });

    // Optional: localStorage fallback (if you ever enable this)
    // const storedUser = localStorage.getItem('user');
    // const storedToken = localStorage.getItem('token');
    // if (storedUser && storedToken) {
    //   const user: User = { ...JSON.parse(storedUser), token: storedToken };
    //   this.auth.userSignal.set(user);
    // } else {
    //   this.auth.userSignal.set(null);
    // }
  }
}
