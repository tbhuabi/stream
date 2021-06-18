import { debounceTime, interval } from '@tanbo/stream';

describe('debounceTime', () => {
  test('确保在忽略在等待时间内数据', done => {
    const arr = []
    const sub = interval(5).pipe(debounceTime(10)).subscribe(value => {
      arr.push(value)
    })

    setTimeout(() => {
      sub.unsubscribe()
      expect(arr).toEqual([]);
      done()
    }, 100)
  })
  test('确保达到等等时间发送数据', done => {
    const arr = []
    const sub = interval(10).pipe(debounceTime(7)).subscribe(value => {
      arr.push(value)
    })

    setTimeout(() => {
      sub.unsubscribe()
      expect(arr).toEqual([0, 1, 2, 3]);
      done()
    }, 55)
  })
})
