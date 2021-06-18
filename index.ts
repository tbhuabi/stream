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


const arr = []

of(1, 2, 3).pipe(
  switchMap(value => {
    return new Observable(subscriber => {
      subscriber.next(value + 1)
    })
  })
).subscribe({
  next(value) {
    arr.push(value)
  },
  complete() {
    console.log(arr)
  }
})
