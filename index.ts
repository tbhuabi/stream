import { map, Stream, Subject, BehaviorSubject, interval } from './src/public-api'

interval(1000).pipe(map(i => [i])).subscribe(value => {
  console.log(value)
})
const i = interval(1000).pipe(map(i => [i]), map(i => i[0])).subscribe(value => {
  console.log([value])
  if (value === 2) {
    i.unsubscribe()
  }
})
