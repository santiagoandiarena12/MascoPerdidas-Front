---
name: angular
description: Angular is opinionated and comprehensive - it gives you everything: routing, forms, HTTP, dependency injection, testing. The learning curve is steep, but once you're in, you move fast. The structure it enforces is why enterprises love it. This skill covers Angular 17+, standalone components, signals, the new control flow syntax, and modern Angular patterns. Use when "angular, angular component, angular service, angular routing, angular forms, rxjs, ngrx, angular signals, standalone component, angular ssr" mentioned.
---

# Angular

## Patterns

### **Standalone Components**

**Description:** Self-contained components without NgModules
**When:** All new Angular 17+ development

```typescript
// Standalone components import their dependencies directly.
// No NgModule needed. Cleaner, more explicit, better tree-shaking.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <header>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/about">About</a>
      </nav>
      <app-button (click)="login()">Login</app-button>
    </header>
  `,
})
export class HeaderComponent {
  login() {
    /* ... */
  }
}

// Bootstrap standalone application
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);

// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};
```

### **Signals for Reactive State**

**Description:** Fine-grained reactivity with Angular Signals
**When:** Component state, derived values, effects

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ double() }}</p>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  `,
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log(`Count changed to: ${this.count()}`);
    });
  }

  increment() {
    this.count.update((c) => c + 1);
  }

  decrement() {
    this.count.update((c) => c - 1);
  }
}
```

### **New Control Flow Syntax**

**Description:** Built-in @if, @for, @switch replacing structural directives
**When:** Angular 17+ templates

```html
@if (loading()) {
<app-spinner />
} @else if (error()) {
<app-error [message]="error()" />
} @else {
<ul>
  @for (user of users(); track user.id) {
  <li>{{ user.name }}</li>
  } @empty {
  <li>No users found</li>
  }
</ul>
} @switch (status()) { @case ('pending') {
<span class="badge-yellow">Pending</span>
} @case ('approved') {
<span class="badge-green">Approved</span>
} @default {
<span>Unknown</span>
} } @defer (on viewport) {
<app-heavy-component />
} @placeholder {
<div>Loading...</div>
}
```

### **Reactive Forms**

**Description:** Form handling with FormBuilder and validators
**When:** Complex forms with validation and dynamic fields

```typescript
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="email">Email</label>
        <input id="email" formControlName="email" />
        @if (form.controls.email.errors?.['required'] && form.controls.email.touched) {
          <span class="error">Email is required</span>
        }
      </div>
      <button type="submit" [disabled]="form.invalid">Register</button>
    </form>
  `,
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

## Anti-Patterns

### **Logic in Templates**

Method calls in templates run on every change detection cycle. Use computed signals instead.

```typescript
// WRONG
<div>{{ getFullName() }}</div>

// RIGHT
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
<div>{{ fullName() }}</div>
```

### **Subscribe in Components**

Use async pipe or toSignal for automatic cleanup.

```typescript
// WRONG
ngOnInit() {
  this.userService.getUser().subscribe(user => {
    this.user = user;
  });
}

// RIGHT - async pipe
user$ = this.userService.getUser();
<div>{{ (user$ | async)?.name }}</div>

// RIGHT - toSignal
user = toSignal(this.userService.getUser());
<div>{{ user()?.name }}</div>
```

### **Default Change Detection**

Use OnPush for better performance.

```typescript
// WRONG
@Component({ ... })
export class MyComponent {}

// RIGHT
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})
export class MyComponent {}
```

### **NgModules for Everything**

Use standalone components instead.

```typescript
// WRONG
@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule],
  exports: [UserComponent]
})
export class UserModule {}

// RIGHT
@Component({
  standalone: true,
  imports: [CommonModule],
  ...
})
export class UserComponent {}
```

### **Any Types**

Use proper TypeScript types.

```typescript
// WRONG
data: any;

// RIGHT
data: User | null = null;
```
