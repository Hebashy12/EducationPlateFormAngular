import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

 const passwordMatchValidator =
 (passwordKey: string, confirmPasswordKey: string): ValidatorFn =>
  (form: AbstractControl): ValidationErrors | null =>
    form.get(passwordKey)?.value === form.get(confirmPasswordKey)?.value
      ? null
      : { passwordMismatch: true };

     export default passwordMatchValidator;   