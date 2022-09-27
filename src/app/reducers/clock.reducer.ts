import * as fromClockActions from './../clock/clock.actions';
import { createReducer, on } from '@ngrx/store';
import { Clock } from '../entities/clock';

export const clockFeatureKey = 'clock';

export const initialState: Clock = {
  isRunning: false,
  durationSeconds: 60 * 5,
  elapsedSeconds: 0,
};

export const reducer = createReducer(
  initialState,
  on(fromClockActions.stopClock, (state, { elapsed }) => ({
    ...state,
    isRunning: false,
    elapsedSeconds: elapsed,
  })),
  on(fromClockActions.startClock, (state) => ({
    ...state,
    isRunning: true,
  })),
  // even though we overwrite the whole state, we still copy the last state for future proofing in case we change the state
  on(fromClockActions.resetClock, (state) => ({
    ...state,
    isRunning: false,
    elapsedSeconds: 0,
  })),
  on(fromClockActions.setClock, (state, { elapsed, duration }) => ({
    ...state,
    isRunning: false,
    elapsedSeconds: elapsed,
    durationSeconds: duration,
  }))
);
