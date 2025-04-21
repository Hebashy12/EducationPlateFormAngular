import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService, User } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showHeaderAndFooter = false; // Flag to control visibility of header and footer
  auth = inject(AuthService);

  constructor(private router: Router) {
    // Subscribe to router events to check the route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Debug: Check the event URL to ensure it is detecting correctly
        console.log('Navigation event URL:', event.urlAfterRedirects);

        // Show header and footer only when on the 'Courses' page or root ('')
        this.showHeaderAndFooter = event.urlAfterRedirects === '/courses' || event.urlAfterRedirects === '/';
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
  }
}


    // Optional: localStorage fallback (if you ever enable this)
    // const storedUser = localStorage.getItem('user');
    // const storedToken = localStorage.getItem('token');
    // if (storedUser && storedToken) {
    //   const user: User = { ...JSON.parse(storedUser), token: storedToken };
    //   this.auth.userSignal.set(user);
    // } else {
    //   this.auth.userSignal.set(null);
    // }
