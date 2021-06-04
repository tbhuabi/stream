import {
  map,
  Stream,
  Subject,
  BehaviorSubject,
  interval,
  fromEvent,
  auditTime,
  throttleTime,
  debounceTime
} from './src/public-api'

fromEvent(document.getElementById('button'), 'click').pipe(auditTime(2000)).subscribe(event => {
  console.log(event)
})
