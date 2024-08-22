import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egereso.model';

export const setItems = createAction(
  '[IngresoEgreso] Set Items',
  props<{items: IngresoEgreso[]}>(),
);

export const unSetItems = createAction('[IngresoEgreso] Un SetItems');
