import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


import { CommonModule } from '@angular/common'; // ✅ For *ngIf, *ngFor
import { AuthService } from '../../auth.service';
import passwordMatchValidator from '../../customValidators/passwordMatchValidator';

@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  firstNameFocused = false;
  lastNameFocused = false;
  emailFocused = false;
  passwordFocused = false;
  confirmPasswordFocused = false;

  private readonly auth = inject(AuthService);
  constructor(private readonly router: Router , private readonly route : ActivatedRoute) {}
  submitForm() {
    if (this.registerUserForm.invalid)

      return;

const {email,password,firstName,lastName} = this.registerUserForm.value;
if(!(email&&password&&firstName&&lastName))
  throw new Error("empty form data")
    this.auth.register(
      {
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        type: 'client',
      }).subscribe(
        {
          next: (data) => {
           // if (data.status === 201 && data.body) {
              console.log('User registered successfully:', data);
              //localStorage.setItem('token', data.token); // Store the token in local storage
              //localStorage.setItem('user', JSON.stringify(data)); // Store the user data in local storage
              this.auth.userSignal.set(data); // Set the user data in the signal
              const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

              this.router.navigateByUrl(returnUrl, { replaceUrl: true }); // Navigate to home page after successful registration.
           // }

          },
          error: (error) => {
            console.error('Error registering user:', error);
          },
        }
      );






    this.registerUserForm.reset();
    // this.router.navigateByUrl('/'); // Navigate to home page after successful registration.
  }
  protected readonly registerUserForm = new FormGroup(
    {
      firstName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
      lastName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
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
      confirmPassword: new FormControl<string>('', [Validators.required]),
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') }
  );


  protected get firstNameError() {
    const firstNameControl = this.registerUserForm.get('firstName');
    if (
      firstNameControl?.hasError('required') &&
      (firstNameControl?.dirty || firstNameControl?.touched)
    )
      return 'First name is required.';
    if (
      firstNameControl?.hasError('minlength') &&
      (firstNameControl?.dirty || firstNameControl?.touched)
    )
      return 'First name should be at least 3 characters long.';
    if (
      firstNameControl?.hasError('maxlength') &&
      (firstNameControl?.dirty || firstNameControl?.touched)
    )
      return 'First name should not exceed 10 characters.';
    return '';
  }
  protected get lastNameError() {
    const lastNameControl = this.registerUserForm.get('lastName');
    if (
      lastNameControl?.hasError('required') &&
      (lastNameControl?.dirty || lastNameControl?.touched)
    )
      return 'Last name is required.';
    if (
      lastNameControl?.hasError('minlength') &&
      (lastNameControl?.dirty || lastNameControl?.touched)
    )
      return 'Last name should be at least 3 characters long.';
    if (
      lastNameControl?.hasError('maxlength') &&
      (lastNameControl?.dirty || lastNameControl?.touched)
    )
      return 'Last name should not exceed 10 characters.';
    return '';
  }

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
  protected get confirmPasswordError() {
    const confirmPasswordControl = this.registerUserForm.get('confirmPassword');
    if (
      confirmPasswordControl?.hasError('required') &&
      (confirmPasswordControl?.dirty || confirmPasswordControl?.touched)
    )
      return 'Confirm password is required.';
    if (
      this.registerUserForm?.hasError('passwordMismatch') &&
      (confirmPasswordControl?.dirty || confirmPasswordControl?.touched)
    )
      return 'Passwords do not match.';
    return '';
  }
}
