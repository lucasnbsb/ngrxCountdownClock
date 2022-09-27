import { Clock } from './../entities/clock';
import { resetClock } from './clock.actions';
import { selectClock } from './../selectors/clock.selectors';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fromClockActions from './../clock/clock.actions';
import { Store } from '@ngrx/store';
import { interval, Subscription, take, timer } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit {
  constructor(private store: Store) {}

  clock$ = this.store.select(selectClock);

  ticker: Subscription | undefined;

  public clockSnapshot: any;
  public remaining: number = 0;
  public elapsed: number = 0;

  @Input()
  public minutes: number = 0;

  @Output()
  public countdownEnded: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {
    // whenever the store changes we get a snapshot of the current value to operate with
    // its important to note that you can't just subscribe to clock and take the values in there
    // to process the changes, because when the store changes it triggers the subscription again
    this.clock$.subscribe((clock) => {
      this.clockSnapshot = clock;
      this.remaining = clock.durationSeconds - clock.elapsedSeconds;
    });

    // initialize the clock timer with some default values. after the subscription to take the first snapshot of the clock
    this.store.dispatch(
      fromClockActions.setClock({
        duration: this.minutes * 60,
        elapsed: 0,
      })
    );
  }

  stopClock() {
    if (this.clockSnapshot.isRunning) {
      this.store.dispatch(
        fromClockActions.stopClock({
          elapsed: this.elapsed + this.clockSnapshot.elapsedSeconds,
        })
      );
      // remember to clean up your subscriptions.
      this.ticker?.unsubscribe();
    }
  }

  // thats why we set some default values, those can be inputs for your clock component
  resetClock() {
    this.ticker?.unsubscribe();
    this.store.dispatch(fromClockActions.resetClock());
  }

  startClock() {
    if (!this.clockSnapshot.isRunning) {
      this.store.dispatch(fromClockActions.startClock());
      this.ticker = interval(1000)
        .pipe(
          take(
            this.clockSnapshot.durationSeconds -
              this.clockSnapshot.elapsedSeconds
          )
        )
        .subscribe({
          next: (interval) => {
            this.elapsed = interval + 1; //interval starts at zero
            this.remaining =
              this.clockSnapshot.durationSeconds -
              this.clockSnapshot.elapsedSeconds -
              this.elapsed;
          },
          complete: () => {
            this.countdownEnded.emit(true);
            this.store.dispatch(
              fromClockActions.stopClock({
                elapsed: this.clockSnapshot.durationSeconds,
              })
            );
          },
        });
    }
  }

  formatRemainingAsMinutes(remaining: number) {
    return Math.floor(remaining / 60);
  }

  formatRemainingAsSeconds(remaining: number) {
    return Math.floor(remaining % 60);
  }
}
