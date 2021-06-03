import { map, Stream, Subject, BehaviorSubject } from './src/public-api'


let i = 0
const stream = new BehaviorSubject<number>(6)

const a = stream.subscribe(value => {
  console.log('aaa', value)
  // setTimeout(() => {
  //   a.unsubscribe()
  // })
})

stream.subscribe(value => {
  console.log('bbb', value)
})

stream.next(999)
stream.next(111)
// setTimeout(() => {
//   stream.next(888)
// }, 2000)
