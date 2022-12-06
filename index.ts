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
  debounceTime, take, zip, race, of, throwError, concat, delay, merge, distinctUntilChanged, timeout, share, microTask
} from './src/public-api'


const obs = fromEvent(document, 'mouseup').pipe(take(1)).subscribe(() => {
  console.log('----')
  console.log(obs)
  obs.unsubscribe()
})
