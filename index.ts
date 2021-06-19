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

interval().pipe(map(i => {
  if (i === 2) {
    throw new Error('map')
  }
  return i + 1
})).subscribe({
  next(value) {
    console.log(value);
  },
  error(err) {
    console.log(err)
  }
})
