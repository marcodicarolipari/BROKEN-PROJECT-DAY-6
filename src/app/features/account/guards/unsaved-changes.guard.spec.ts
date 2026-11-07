import { TestBed } from '@angular/core/testing';
import { unsavedChangesGuard, CanComponentDeactivate } from './unsaved-changes.guard';

describe('unsavedChangesGuard', () => {
  let spyOnWindowConfirm: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    spyOnWindowConfirm = spyOn(window, 'confirm');
  });

  it('should allow navigation when component returns true (no unsaved changes)', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => true,
    };

    const result = unsavedChangesGuard(component);

    expect(result).toBe(true);
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('should show confirm dialog when component returns false (has unsaved changes)', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => false,
    };

    spyOnWindowConfirm.and.returnValue(true);
    const result = unsavedChangesGuard(component);

    expect(window.confirm).toHaveBeenCalledWith(
      'Hai modifiche in sospeso. Sei sicuro di voler abbandonare la pagina?'
    );
    expect(result).toBe(true);
  });

  it('should prevent navigation when user cancels the confirm dialog', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => false,
    };

    spyOnWindowConfirm.and.returnValue(false);
    const result = unsavedChangesGuard(component);

    expect(window.confirm).toHaveBeenCalledWith(
      'Hai modifiche in sospeso. Sei sicuro di voler abbandonare la pagina?'
    );
    expect(result).toBe(false);
  });
});
