import {
  map,
  Stream,
  Subject,
  BehaviorSubject,
  interval,
  fromEvent,
  auditTime,
  throttleTime,
  debounceTime, take, zip, race, of, concat, delay
} from './src/public-api'


let sub = interval(1000, 1)
  .pipe(take(1))
  .pipe(
    concat(
      of(2, 3).pipe(delay()),
      of(4, 5).pipe(delay())
    )
  ).subscribe(value => {
  console.log(value)
  // if (value === 3) {
  //   sub.unsubscribe()
  // }
}, err => {
  throw err
}, () => {
  console.log('complete')
})

// of(1, 2)
//   .pipe(delay(1000))
//   .subscribe(value => {
//     console.log(value)
//   }, err => {
//     throw err
//   }, () => {
//     console.log('complete')
//   })
