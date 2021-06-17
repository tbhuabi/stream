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


new Stream(subscriber => {
  subscriber.next(333)
  // subscriber.error('444')
}).pipe(delay(2000)).subscribe({
  next(value) {
    console.log(value)
  },
  error(){}
})
