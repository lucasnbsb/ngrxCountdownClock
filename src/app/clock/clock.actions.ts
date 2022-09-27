import { createAction, props } from '@ngrx/store';

export const setClock = createAction(
  '[Clock] Set Clock',
  props<{ minutes: number; seconds: number }>()
);

export const resetClock = createAction(
  '[Clock] Reset Clock',
  props<{ minutes: number; seconds: number }>()
);

// no props needed, just sets isRunning = true
export const startClock = createAction('[Clock] Start Clock');

// no props needed, just sets isRunning = false
export const stopClock = createAction('[Clock] Stop Clock');
