import {
  map,
  Stream,
  Subject,
  BehaviorSubject,
  interval,
  fromEvent,
  auditTime,
  throttleTime,
  debounceTime, take, zip, race, of, concat, delay, merge
} from './src/public-api'

race(of(1), of('3')).subscribe(value => {

})

merge(of(1), of('2')).subscribe()

let sub = interval(1000, 1).pipe(take(1))
  .pipe(
    concat(
      of(2, 3).pipe(delay()),
      of(4, 5).pipe(delay())
    )
  )
  .subscribe(value => {
    console.log(value)
    if (value === 4) {
      console.log('unsub')
      sub.unsubscribe()
    }
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
