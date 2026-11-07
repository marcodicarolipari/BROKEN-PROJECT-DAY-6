import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { AuthService } from '../../../core/services/auth.service';
import { CanComponentDeactivate } from '../guards/unsaved-changes.guard';

/**
 * AccountDashboardComponent — mostra il saldo e i dati del conto corrente.
 */
@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './account-dashboard.component.html',
})
export class AccountDashboardComponent implements OnInit, CanComponentDeactivate {
  account: Account | undefined;
  isEditing = signal(false);
  
  private accountService = inject(AccountService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const userId = this.authService.getCurrentUser()?.id;
    if (userId) {
      this.accountService.getAccountById(userId).subscribe({
        next: (account) => {
          this.account = account;
        },
        error: (error) => {
          console.error('Error loading account:', error);
          this.account = undefined;
        }
      });
    }
  }

  canDeactivate(): boolean {
    // Se non siamo in modalità editing, consenti la navigazione
    if (!this.isEditing()) {
      return true;
    }
    // Se siamo in modalità editing, il guard chiederà conferma
    return false;
  }

  toggleEditMode(): void {
    this.isEditing.update((value) => !value);
  }

  saveChanges(): void {
    // Simula il salvataggio
    console.log('Profilo salvato');
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }
}
