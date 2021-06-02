import { map, Stream } from './src/public-api'


const stream = new Stream<number>(observer => {
  const timer = setInterval(() => {
    observer.next(Math.random())
  }, 1000)

  observer.onUnsubscribe(() => {
    clearInterval(timer)
  })
})

let i = 0
const unListen = stream.pipe(map(value => {
  return {
    value
  }
})).pipe(map(value => {
  return JSON.stringify(value)
})).subscribe(value => {
  console.log(['value:', i, value])
  i++
  if (i > 5) {
    unListen.unsubscribe();
  }
})
