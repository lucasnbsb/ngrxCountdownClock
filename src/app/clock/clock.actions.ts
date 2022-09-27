import { createAction, props } from '@ngrx/store';

// no props needed, just sets isRunning = false
export const stopClock = createAction(
  '[Clock] Stop Clock',
  props<{ elapsed: number }>()
);

// no props needed, just sets isRunning = true
export const startClock = createAction('[Clock] Start Clock');

export const setClock = createAction(
  '[Clock] Set Clock',
  props<{ elapsed: number; duration: number }>()
);

export const resetClock = createAction('[Clock] Reset Clock');
