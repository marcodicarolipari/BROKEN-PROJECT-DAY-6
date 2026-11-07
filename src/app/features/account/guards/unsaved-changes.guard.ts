import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
) => {
  if (component.canDeactivate()) {
    return true;
  }

  return window.confirm(
    'Hai modifiche in sospeso. Sei sicuro di voler abbandonare la pagina?'
  );
};
