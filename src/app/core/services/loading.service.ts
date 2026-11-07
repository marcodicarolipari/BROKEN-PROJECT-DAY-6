import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

/**
 * LoadingService — gestisce lo stato globale di loading durante la navigazione.
 * Usato da AppComponent per mostrare/nascondere lo spinner.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = signal(false);

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }
}
