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
    // initialize the clock timer
    this.store.dispatch(
      fromClockActions.setClock({
        minutes: this.defaultClockMinutes,
        seconds: this.defaultClockSeconds,
      })
    );

    // whenever the store changes we get a snapshot of the current value to operate with
    this.clock$.subscribe((clock) => {
      this.minutes = clock.minutes;
      this.seconds = clock.seconds;
    });
  }

  stopClock() {
    this.ticker?.unsubscribe();
    this.store.dispatch(fromClockActions.stopClock());
  }
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
    if (!this.ticker || this.ticker?.closed) {
      this.ticker = timer(0, 1000).subscribe(() => {
        if (this.seconds == 0) {
          if (this.minutes == 0) {
            this.store.dispatch(fromClockActions.stopClock());
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
