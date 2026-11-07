import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LoadingIndicatorComponent } from './shared/components/loading-indicator/loading-indicator.component';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

/**
 * AppComponent — shell principale dell'applicazione.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoadingIndicatorComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  private loadingInterceptor = inject(LoadingInterceptor);

  currentUser() {
    return this.authService.currentUser();
  }

  isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  isAdmin() {
    return this.authService.getCurrentUser()?.role === 'admin';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
