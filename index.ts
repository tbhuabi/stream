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
  debounceTime, take, zip, race, of, concat, delay, merge, distinctUntilChanged, timeout, share
} from './src/public-api'

const sharedObs = interval().pipe(share())
sharedObs.subscribe(value => {
  console.log(value)
})

setTimeout(() => {
  sharedObs.subscribe(value => {
    console.log(value)
  })
}, 2100)
