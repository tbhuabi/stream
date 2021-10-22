import { interval, of, throttleTime } from '@tanbo/stream';

describe('throttleTime', () => {
  test('确保发送最初值', () => {
    let i!: number
    of(1).pipe(throttleTime(10)).subscribe(value => {
      i = value
    })
    expect(i).toBe(1)
  })
  test('确保忽略间隔时间内的值', done => {
    const arr: number[] = []
    const sub = interval(10).pipe(throttleTime(17)).subscribe({
      next(value) {
        arr.push(value)
      }
    })

    setTimeout(() => {
      sub.unsubscribe();
      expect(arr).toEqual([0, 2, 4, 6, 8])
      done()
    }, 110)
  })
})
