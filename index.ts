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
  debounceTime, take, zip, race, of, concat, delay, merge, distinctUntilChanged, timeout, share, microTask
} from './src/public-api'


of(1, 2, 3, 4).pipe(delay()).subscribe(value => {
  console.log('宏', value)
})

of(1, 2, 3, 4).pipe(microTask()).subscribe(value => {
  console.log('微：', value)
})
of(1, 2, 3, 4).subscribe(value => {
  console.log('普通', value)
})
