import { of, race, timeout } from '@tanbo/stream';

describe('race', () => {
  test('发送时间最近的值', done => {
    const unsub = race(timeout(100, 1), timeout(10, 2)).subscribe(value => {
      unsub.unsubscribe();
      expect(value).toBe(2)
      done()
    })
  })
  test('只发送一个值', done => {
    const arr: any[] = []
    race(of(1, 2)).subscribe({
      next(v) {
        arr.push(v)
      },
      complete() {
        expect(arr).toEqual([1])
        done()
      }
    })
  })

  test('取消订阅后不再发送', done => {
    const arr: any[] = []
    const sub = race(timeout(1)).subscribe(value => {
      arr.push(value)
    })
    sub.unsubscribe()
    setTimeout(() => {
      expect(arr.length).toBe(0)
      done()
    }, 10)
  })
})
