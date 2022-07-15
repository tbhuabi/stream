import {
  map,
  Observable,
  Subject,
  BehaviorSubject,
  interval,
  fromEvent,
  sampleTime,
  throttleTime,
  switchMap,
  debounceTime, take, zip, race, of, throwError, concat, delay, merge, distinctUntilChanged, timeout, share, microTask
} from './src/public-api'


// fromEvent(document.getElementById('button')!, 'click')
interval()
  .pipe(
    take(5),
    debounceTime(1500),
  ).subscribe({
  next(v) {
    console.log(v)
  },
  complete() {
    console.log('complete')
  }
})
