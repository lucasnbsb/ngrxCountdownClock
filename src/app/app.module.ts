import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import * as fromClock from './reducers/clock.reducer';
import { ClockComponent } from './clock/clock.component';

@NgModule({
  declarations: [AppComponent, ClockComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(fromClock.clockFeatureKey, fromClock.reducer),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
