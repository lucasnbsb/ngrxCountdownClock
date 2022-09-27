# NgrxCountdownClock

This repo is a tutorial for ngrx 14 and ngrx/schematics, documenting all the steps necessary to implement a countdown clock with ngrx and angular.

## Installation of dependencies

assuming angular-cli is installed:

Adding ngrx

```
    ng add @ngrx/store@latest
```

Adding the ngrx schematics to the default collection of schematics from angular-cli to generate the boilerplate faster. Don`t worry about bundle size, ngadd knows to set it up as a dev dependency

```
ng add @ngrx/schematics@latest
```

## Creating the clock

We start with a simple interface defining the state of the clock.

```
mkdir src/app/entity
touch src/app/entity/clock.ts
```

Then we create the actions for the clock, that is also the time to decide what methods will our store support, `--flat false` tells the schematic to put the action in a folder called clock ( might also ignore and let the actions be in a folder called actions, your choice here)

```
ng g action clock --flat false
```

this results in the following file:

```typescript
import { createAction, props } from "@ngrx/store";

export const loadClocks = createAction("[Clock] Load Clocks");
```

we then add some simple actions,

```typescript
import { createAction, props } from "@ngrx/store";

// no props needed, just sets isRunning = false
export const stopClock = createAction(
  "[Clock] Stop Clock",
  props<{ elapsed: number }>()
);
// no props needed, just sets isRunning = true
export const startClock = createAction("[Clock] Start Clock");

export const setClock = createAction(
  "[Clock] Set Clock",
  props<{ elapsed: number; duration: number }>()
);

export const resetClock = createAction("[Clock] Reset Clock");
```

and create a reducer

```
ng generate reducer clock --group true --module app.module.ts
```

this also sets up the app module with a store for the clock feature. and results in the scaffolding of a reducer:

```typescript
import { Action, createReducer, on } from "@ngrx/store";

export const clockFeatureKey = "clock";

export interface State {}

export const initialState: State = {};

export const reducer = createReducer(initialState);
```

note that `--module app.module.ts` sets up a index.ts file in the reducer directory that you can use to organize your reducers, i just used it in a feature store.

We then link up the actions in the reducer, the `...state` should be there even if you are overiding the whole state
because eventually you might want to change the shape of the state.

Also note how we import the actions for clarity

```typescript
import * as fromClockActions from "./../clock/clock.actions";
import { createReducer, on } from "@ngrx/store";
import { Clock } from "../entities/clock";

export const clockFeatureKey = "clock";

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
```

We then create a selector for the clock state. Take good care of your feature key. We put it in the reducer as a constant,
you might want to put it somewhere else

```
ng g selector clock --group true
```

```typescript
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Clock } from "../entities/clock";
import { clockFeatureKey } from "../reducers/clock.reducer";

// here we select the state by the feature key
export const selectClock =
  createFeatureSelector<Readonly<Clock>>(clockFeatureKey);
```

and finally a component to use the store and display the clock

```
ng g c clock
```

the `clock.component.ts` file has been anotated with the important concepts.

The view is pretty simple, take note how the `clock$` observable is used.
That is to prevent errors with uninitialized values, also the number formatting pipe
come in to make the numbers actually look like clock numbers by setting 2 decimal places as default

```html
Clock object in store: {{ clock$ | async | json }}

<div *ngIf="clock$ | async as clock">
  pretty print: {{ formatRemainingAsMinutes(remaining) | number: "2.0-0" }} : {{
  formatRemainingAsSeconds(remaining) | number: "2.0-0" }}
</div>

<button (click)="startClock()">start</button>
<button (click)="stopClock()">stop</button>
<button (click)="resetClock()">reset</button>
```
