import * as fromClockActions from './../clock/clock.actions';
import { createReducer, on } from '@ngrx/store';
import { Clock } from '../entities/clock';

export const clockFeatureKey = 'clock';

export const initialState: Clock = {
  isRunning: false,
  minutes: 10,
  seconds: 0,
};

export const reducer = createReducer(
  initialState,
  on(fromClockActions.stopClock, (state) => ({
    ...state,
    isRunning: false,
  })),
  on(fromClockActions.startClock, (state) => ({
    ...state,
    isRunning: true,
  })),
  // even though we overwrite the whole state, we still copy the last state for future proofing in case we change the state
  on(fromClockActions.resetClock, (state, { minutes, seconds }) => ({
    ...state,
    isRunning: false,
    minutes: minutes,
    seconds: seconds,
  })),
  on(fromClockActions.setClock, (state, { minutes, seconds }) => ({
    ...state,
    minutes: minutes,
    seconds: seconds,
  }))
);
