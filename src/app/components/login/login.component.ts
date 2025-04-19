import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { CommonModule } from '@angular/common'; // ✅ For *ngIf, *ngFor
import { RouterLink } from '@angular/router'; // ✅ Needed for routerLink in the template
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,           // ✅ Enables *ngIf and other directives
    ReactiveFormsModule,    // ✅ Enables formGroup, formControlName, etc.
    RouterLink              // ✅ Enables [routerLink] in the template
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  emailFocused = false;
  passwordFocused = false;

  constructor(private readonly router: Router , private readonly route : ActivatedRoute) {}
  auth = inject(AuthService);
  submitForm() {
    if (this.registerUserForm.invalid) return;

    const { email, password, rememberMe } = this.registerUserForm.value;
    if (
      email === null ||
      email === undefined ||
      password === null ||
      password === undefined ||
      rememberMe === null ||
      rememberMe === undefined
    )
      throw new Error('empty form data');
    this.auth
      .login({
        email,
        password,
        rememberMe,
      })
      .subscribe({
        next: (data) => {
          // if (data.status === 200 && data.body) {
          console.log('User logged in successfully:', data);
         // localStorage.setItem('token', data.token); // Store the token in local storage

         // localStorage.setItem('user', JSON.stringify(data)); // Store the user data in local storage
          this.auth.userSignal.set(data); // Set the user data in the signal

          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

          this.router.navigateByUrl(returnUrl, { replaceUrl: true });
          // }
        }
        ,
        error: (error) => {
          console.error('Error Logging in user:', error);
        },
      });
    this.registerUserForm.reset();
  }



  protected readonly registerUserForm = new FormGroup({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
    rememberMe: new FormControl<boolean>(false),
  });

  protected get emailError() {
    const emailControl = this.registerUserForm.get('email');
    if (
      emailControl?.hasError('required') &&
      (emailControl?.dirty || emailControl?.touched)
    )
      return 'Email is required.';

    if (
      emailControl?.hasError('pattern') &&
      (emailControl?.dirty || emailControl?.touched)
    )
      return 'Invalid email format.';
    return '';
  }
  protected get passwordError() {
    const passwordControl = this.registerUserForm.get('password');
    if (
      passwordControl?.hasError('required') &&
      (passwordControl?.dirty || passwordControl?.touched)
    )
      return 'Password is required.';
    if (
      passwordControl?.hasError('pattern') &&
      (passwordControl?.dirty || passwordControl?.touched)
    )
      return 'Invalid password format. Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    return '';
  }
}
