import {
  map,
  Observable,
  Subject,
  BehaviorSubject,
  interval,
  fromEvent,
  auditTime,
  throttleTime,
  switchMap,
  debounceTime, take, zip, race, of, concat, delay, merge, distinctUntilChanged, timeout
} from './src/public-api'


interval(1000, 2).subscribe(value => {
  console.log(value)
})
