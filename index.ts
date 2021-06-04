import { map, Stream, Subject, BehaviorSubject, interval, fromEvent, auditTime, throttleTime } from './src/public-api'

fromEvent(document.getElementById('button'), 'click').pipe(throttleTime(2000)).subscribe(event => {
  console.log(event)
})
