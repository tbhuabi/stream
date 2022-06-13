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


zip(of('a', 'b', 'c'), of(1, 2, 3), interval(1000)).subscribe({
  next(value) {
    console.log(value)
  },
  complete() {
    console.log('complete')
  }
})
