import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Clock } from '../entities/clock';
import { clockFeatureKey } from '../reducers/clock.reducer';

// here we select the state by the feature key
export const selectClock =
  createFeatureSelector<Readonly<Clock>>(clockFeatureKey);
