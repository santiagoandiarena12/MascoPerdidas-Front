import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';

function passwordComplexityValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value ?? '';
  if (!value) {
    return null;
  }

  const hasUppercase = /[A-Z]/.test(value);
  const hasMinLength = value.length >= 8;

  if (!hasUppercase || !hasMinLength) {
    return { passwordComplexity: true };
  }

  return null;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule, NgOptimizedImage],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly registerForm = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordComplexityValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: (group) => {
        const password = group.get('password')?.value ?? '';
        const confirm = group.get('confirmPassword')?.value ?? '';
        if (!password || !confirm) {
          return null;
        }
        return password === confirm ? null : { passwordMismatch: true };
      },
    },
  );

  get passwordMismatch(): boolean {
    return !!this.registerForm.errors?.['passwordMismatch'];
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.registerForm.getRawValue();
    this.auth.register({ fullName, email, password });
  }
}

