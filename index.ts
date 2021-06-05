import {
  map,
  Stream,
  Subject,
  BehaviorSubject,
  interval,
  fromEvent,
  auditTime,
  throttleTime,
  switchMap,
  debounceTime, take, zip, race, of, concat, delay, merge, distinctUntilChanged
} from './src/public-api'

interval(1000).pipe(throttleTime(2000)).subscribe(value => {
  console.log(value);
})
