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
  debounceTime, take, zip, race, of, concat, delay, merge, distinctUntilChanged, timeout
} from './src/public-api'


of(1, 2, 3).pipe(delay(3000)).subscribe({
  next(v) {
    throw new Error('xxx')
  },
  // error(err) {
  //   console.log(err)
  // },
  complete() {
    console.log('complete')
  }
})
