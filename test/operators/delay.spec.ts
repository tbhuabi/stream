import { delay, of } from '@tanbo/stream';

describe('delay', () => {
  test('确保数据流延迟', done => {
    const arr = []
    const sub = of(1, 2, 3).pipe(delay(200)).subscribe(value => {
      arr.push(value)
    })
    setTimeout(() => {
      sub.unsubscribe()
      expect(arr).toEqual([])
      done()
    }, 190)
  })
  test('确保延迟收到数据流', done => {
    const arr = []
    const sub = of(1, 2, 3).pipe(delay(200)).subscribe(value => {
      arr.push(value)
    })
    setTimeout(() => {
      sub.unsubscribe()
      expect(arr).toEqual([1, 2, 3])
      done()
    }, 210)
  })
})
