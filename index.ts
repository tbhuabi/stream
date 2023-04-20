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
  debounceTime,
  take,
  zip,
  race,
  of,
  throwError,
  concat,
  delay,
  merge,
  distinctUntilChanged,
  timeout,
  share,
  microTask,
  bufferTime,
  skip
} from './src/public-api'


// const obs = fromEvent(document, 'mouseup').pipe(take(1)).subscribe(() => {
//   console.log('----')
//   console.log(obs)
//   obs.unsubscribe()
// })

const obs = interval(200)

merge(
  obs.pipe(
    take(1),
    map(value => {
      return [value]
    })
  ),
  obs.pipe(
    skip(1),
    bufferTime(1000)
  )
).subscribe(values => {
  console.log(values)
})
