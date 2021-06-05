import {
  map,
  Stream,
  Subject,
  BehaviorSubject,
  interval,
  fromEvent,
  auditTime,
  throttleTime,
  debounceTime, take
} from './src/public-api'

fromEvent(document.getElementById('button'), 'click')
  .pipe(
    auditTime(1000),
    take(2),
  )
  .subscribe(event => {
    console.log(event)
  })
