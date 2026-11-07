import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../app.routes';
import { AuthService } from '../../core/services/auth.service';
import { AccountService } from './services/account.service';
import { AccountDashboardComponent } from './dashboard/account-dashboard.component';

describe('account routes', () => {
  beforeEach(() => {
    registerLocaleData(localeIt);
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        {
          provide: AccountService,
          useValue: {
            getAccountById: () => of({
              id: 'ACC001',
              ownerId: '1',
              ownerName: 'Mario Rossi',
              balance: 100,
              currency: 'EUR',
              iban: 'IT00',
            }),
          },
        },
      ],
    });
    TestBed.inject(AuthService).login('customer');
  });

  it('renders movements on direct navigation', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard/movimenti');
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/dashboard/movimenti');
    expect(harness.routeNativeElement?.textContent).toContain('Ultimi Movimenti');
  });

  it('opens movements from the dashboard link', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    harness.detectChanges();

    const link = harness.routeNativeElement?.querySelector('a');
    expect(link).toBeTruthy();
    link!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/dashboard/movimenti');
    expect(harness.routeNativeElement?.textContent).toContain('Ultimi Movimenti');
  });

  it('should prevent navigation away from dashboard when in edit mode', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    harness.detectChanges();

    const component = harness.routeComponent as AccountDashboardComponent;
    component.toggleEditMode();
    harness.detectChanges();

    spyOn(window, 'confirm').and.returnValue(false);

    const canDeactivate = await harness.evaluateGuards();
    expect(canDeactivate).toBe(false);
    expect(window.confirm).toHaveBeenCalled();
  });

  it('should allow navigation away from dashboard when user confirms after edit', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    harness.detectChanges();

    const component = harness.routeComponent as AccountDashboardComponent;
    component.toggleEditMode();
    harness.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);

    const canDeactivate = await harness.evaluateGuards();
    expect(canDeactivate).toBe(true);
    expect(window.confirm).toHaveBeenCalled();
  });

  it('should allow navigation away from dashboard without confirmation when not in edit mode', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    harness.detectChanges();

    const component = harness.routeComponent as AccountDashboardComponent;
    expect(component.isEditing()).toBe(false);

    spyOn(window, 'confirm');

    const canDeactivate = await harness.evaluateGuards();
    expect(canDeactivate).toBe(true);
    expect(window.confirm).not.toHaveBeenCalled();
  });
});
