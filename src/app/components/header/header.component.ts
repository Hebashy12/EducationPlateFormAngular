import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService, User } from '../../auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
ApiCall() {

  this.auth.ApiCall().subscribe({
    next: (data) => {
      console.log('API call successful:', data);
    },
    error: (error) => {
      console.error('API call error:', error);
    },
  });

}
  auth = inject(AuthService);
  router = inject(Router);

  protected onRefresh() {
    this.auth.refreshToken().subscribe({
      next: ({accessToken}) => {
        console.log('Token refreshed successfully',accessToken);

        //localStorage.setItem('token', data.accessToken);
        const decodedToken = jwtDecode<{user: Omit<User,'token'> }>(accessToken);

        const  user: User = { ...decodedToken.user, token: accessToken };

        console.log(user);
        //localStorage.setItem('user', JSON.stringify(user));
        this.auth.userSignal.set(user);
      },
      error: (refreshError) => {
        console.error('Error refreshing token from refresh button on header component:', refreshError);
      },
    });
  }

  protected onLogout() {
    this.auth.logout().subscribe({
      next: (data) => {
        //if (data.status === 200&& data.body) {
        console.log('User logged out successfully:', data);
        //localStorage.removeItem('token'); // Remove the token from local storage
        //localStorage.removeItem('user'); // Remove the user data from local storage
        this.auth.userSignal.set(null); // Clear the user data in the signal
        this.router.navigate(['/']); // Redirect to login page after logout
        // }
      },
      error: (error) => {
        console.error('Error logging out user:', error);
      },
    });
  }

  constructor() {}

  ngOnInit(): void {
    // Initialization logic can go here
  }

  // Add any methods or properties needed for the header component here

}
