import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AccountDashboardComponent } from './account-dashboard.component';
import { AccountService } from '../services/account.service';
import { AuthService } from '../../../core/services/auth.service';
import { Account } from '../models/account.model';

describe('AccountDashboardComponent', () => {
  let component: AccountDashboardComponent;
  let fixture: ComponentFixture<AccountDashboardComponent>;
  let accountService: jasmine.SpyObj<AccountService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockAccount: Account = {
    id: 'ACC001',
    ownerId: '1',
    ownerName: 'Mario Rossi',
    balance: 1000,
    currency: 'EUR',
    iban: 'IT00X0000000000000000000000',
  };

  beforeEach(async () => {
    const accountServiceSpy = jasmine.createSpyObj('AccountService', ['getAccountById']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [AccountDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    accountService.getAccountById.and.returnValue(of(mockAccount));
    authService.getCurrentUser.and.returnValue({ id: '1', role: 'customer' } as any);

    fixture = TestBed.createComponent(AccountDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load account on init', () => {
    expect(accountService.getAccountById).toHaveBeenCalledWith('1');
    expect(component.account).toEqual(mockAccount);
  });

  it('should allow deactivation when not in edit mode', () => {
    component.isEditing.set(false);
    expect(component.canDeactivate()).toBe(true);
  });

  it('should prevent deactivation when in edit mode', () => {
    component.isEditing.set(true);
    expect(component.canDeactivate()).toBe(false);
  });

  it('should toggle edit mode', () => {
    expect(component.isEditing()).toBe(false);
    component.toggleEditMode();
    expect(component.isEditing()).toBe(true);
    component.toggleEditMode();
    expect(component.isEditing()).toBe(false);
  });

  it('should save changes and exit edit mode', () => {
    component.isEditing.set(true);
    spyOn(console, 'log');

    component.saveChanges();

    expect(console.log).toHaveBeenCalledWith('Profilo salvato');
    expect(component.isEditing()).toBe(false);
  });

  it('should cancel edit mode without saving', () => {
    component.isEditing.set(true);

    component.cancelEdit();

    expect(component.isEditing()).toBe(false);
  });
});
