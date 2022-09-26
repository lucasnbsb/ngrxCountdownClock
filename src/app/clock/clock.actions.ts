import { createAction, props } from '@ngrx/store';

// no partials
export const setClock = createAction(
  '[Clock] Set Clock',
  props<{ minutes: number; seconds: number }>()
);

//also no partials
export const resetClock = createAction(
  '[Clock] Reset Clock',
  props<{ minutes: number; seconds: number }>()
);

// no props needed, just sets isRunning = true
export const startClock = createAction('[Clock] Start Clock');

export const stopClock = createAction('[Clock] Stop Clock');
