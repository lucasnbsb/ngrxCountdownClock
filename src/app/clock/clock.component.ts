import { resetClock } from './clock.actions';
import { selectClock } from './../selectors/clock.selectors';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as fromClockActions from './../clock/clock.actions';
import { Store } from '@ngrx/store';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit {
  constructor(private store: Store) {}

  clock$ = this.store.select(selectClock);

  ticker: Subscription | undefined;

  // those two can be inputs for the component
  defaultClockMinutes = 2;
  defaultClockSeconds = 30;

  private minutes = 0;
  private seconds = 0;

  @Output()
  public countdownEnded: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {
    // initialize the clock timer with some default values.
    this.store.dispatch(
      fromClockActions.setClock({
        minutes: this.defaultClockMinutes,
        seconds: this.defaultClockSeconds,
      })
    );

    // whenever the store changes we get a snapshot of the current value to operate with
    // its important to note that you can't just subscribe to clock and take the values in there
    // to process the changes, because when the store changes it triggers the subscription again
    this.clock$.subscribe((clock) => {
      this.minutes = clock.minutes;
      this.seconds = clock.seconds;
    });
  }

  // remember to clean up your subscriptions.
  stopClock() {
    this.ticker?.unsubscribe();
    this.store.dispatch(fromClockActions.stopClock());
  }

  // thats why we set some default values, those can be inputs for your clock component
  resetClock() {
    this.ticker?.unsubscribe();
    this.store.dispatch(
      fromClockActions.resetClock({
        minutes: this.defaultClockMinutes,
        seconds: this.defaultClockSeconds,
      })
    );
  }

  startClock() {
    this.store.dispatch(fromClockActions.startClock());
    // here we prevent multiple starts of the same ticker
    // it's undefined in the first start of the clock and closed thereafter
    if (!this.ticker || this.ticker?.closed) {
      // rxjs come in with the clock timepiece in the form of
      // an observable that emmits every 1000 ms
      this.ticker = timer(0, 1000).subscribe(() => {
        // when you hit zero just count down the minutes
        if (this.seconds == 0) {
          if (this.minutes == 0) {
            this.store.dispatch(fromClockActions.stopClock());
            // this is a good place to either emit an event to alert the parent component
            // or update a behavior subject to alert multiple components
            this.countdownEnded.emit(true);
          } else {
            this.store.dispatch(
              fromClockActions.setClock({
                minutes: this.minutes - 1,
                seconds: 59,
              })
            );
          }
        } else {
          // just count down the seconds untill you hit 0
          this.store.dispatch(
            fromClockActions.setClock({
              minutes: this.minutes,
              seconds: this.seconds - 1,
            })
          );
        }
      });
    }
  }
}
