import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingService } from '../services/loading.service';

/**
 * LoadingInterceptor — ascolta Router.events e mostra/nasconde lo spinner.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingInterceptor {
  constructor(private router: Router, private loadingService: LoadingService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.setLoading(true);
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.setLoading(false);
      }
    });
  }
}



