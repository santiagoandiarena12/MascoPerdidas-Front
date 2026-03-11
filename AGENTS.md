# Angular Best Practices Guide

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Use interfaces for object shapes, enums for fixed values
- Enable `strict: true` in tsconfig.json

## Angular Best Practices

### Architecture

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Keep components small and focused on a single responsibility
- Use the `inject()` function instead of constructor injection

### Components

- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components (less than 50 lines)
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images
  - `NgOptimizedImage` does not work for inline base64 images

### State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available in templates

### Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use `inject()` function instead of constructor injection

### HTTP and API

- Use `HttpClient` for all HTTP requests
- Always handle errors with catchError operator
- Use interceptors for authentication headers and error handling
- Implement retry logic for transient failures
- Use proper typing for HTTP responses

### RxJS

- Use `takeUntilDestroyed()` for cleaning up subscriptions in components
- Avoid subscribing manually when possible - use async pipe
- Use `shareReplay(1)` for caching HTTP requests
- Use `switchMap` for cancelable operations (search)
- Use `concatMap` for sequential operations
- Use `mergeMap`/`flatMap` for parallel operations
- Avoid memory leaks - always unsubscribe or use takeUntilDestroyed

### Security

- Sanitize all user inputs
- UseDomSanitizer only when necessary and safe
- Implement proper CORS handling
- Never expose sensitive data in client-side code
- Use environment variables for API keys and secrets

### Performance

- Use `OnPush` change detection strategy
- Implement lazy loading for all feature modules/routes
- Use virtual scrolling for long lists
- Optimize images - use modern formats (WebP)
- Implement proper caching strategies
- Use trackBy in @for loops

### Accessibility Requirements

- It MUST pass all AXE checks
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes
- All interactive elements must be keyboard accessible
- Provide proper alt text for images
- Use semantic HTML elements

### Testing

- Write unit tests for all components and services
- Use Vitest as the testing framework (already configured)
- Use component fixtures for testing
- Mock all external dependencies
- Test both success and error cases
- Aim for high code coverage

### Environment Configuration

- Use environment files for different configurations
- Never commit secrets to the repository
- Use proper environment variable naming conventions
