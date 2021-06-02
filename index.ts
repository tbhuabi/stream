import { map, Stream } from './src/public-api'


const stream = new Stream<number>(publisher => {
  const timer = setInterval(() => {
    publisher.next(Math.random())
  }, 1000)

  publisher.onUnListen(() => {
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
})).listen(value => {
  console.log(['value:', i, value])
  i++
  if (i > 5) {
    unListen.unListen();
  }
})
