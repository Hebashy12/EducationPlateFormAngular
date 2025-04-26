import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService, User } from './Services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
      next: ({accessToken}) => {

        const decodedToken = jwtDecode<{
          name: string;
          email: string;
          id: string;
          role: ("User"|"Admin");}>(accessToken);

        const user: User = { ...decodedToken, accessToken: accessToken };
        console.log(user);
        this.auth.userSignal.set(user);
      },
      error: (err) => {
        console.log("Refresh error from AppComponent:", err);
        this.auth.userSignal.set(null);
      }
    });
  }
}


