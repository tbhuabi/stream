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
  setTimeout(() => {
    subscriber.error(333)
  })
}).pipe(delay(30000)).subscribe({
  error() {
    console.log(['fdsafdas'])
  }
})
