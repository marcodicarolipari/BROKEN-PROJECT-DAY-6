import { Routes } from '@angular/router';
import { AccountDashboardComponent } from './dashboard/account-dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AccountDashboardComponent,
    canDeactivate: [unsavedChangesGuard],
    children: [
      {
        path: 'movimenti',
        component: TransactionsComponent,
      },
    ],
  },
];
