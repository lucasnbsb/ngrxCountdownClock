# NgrxCountdownClock

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.3.

This project is also a tutorial for ngrx 14, documenting all the steps necessary
to implement a countdown clock with ngrx, material and angular

## Installation of dependencies

assuming angular-cli is installed:

adding angular material

```
    ng add @angular/material
```

Adding ngrx

```
    ng add @ngrx/store@latest
```

Adding the ngrx schematics to the default collection of schematics from angular-cli to generate the boilerplate faster. Don`t worry about bundle size, ngadd knows to set it up as a dev dependency

```
ng add @ngrx/schematics@latest
```

## creating the clock

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

we then add some simple actions and create a reducer

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

we modify the reducer to use our entity and link up the actions. and then create a selector

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
