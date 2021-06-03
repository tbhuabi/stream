import { map, Stream } from './src/public-api'


let i = 0
const stream = new Stream<number>(observer => {
  console.log('fdfdas')
  setTimeout(() => {
    observer.next(555)
  })
})

stream.subscribe(value => {
  console.log(value)
})

setTimeout(() => {
  stream.subscribe(value => {
    console.log(value)
  })
}, 1000)
