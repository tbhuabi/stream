import { interval, of, Observable, timeout, zip } from '@tanbo/stream';

describe('zip', () => {
  test('拼装数据', () => {
    zip(of(1), of(2)).subscribe(value => {
      expect(value).toEqual([1, 2])
    })
  })
  test('等待数据完成', done => {
    zip(of(1), timeout(0, 2)).subscribe(value => {
      expect(value).toEqual([1, 2])
      done()
    })
  })
  test('在所有订阅未完成时更新数据', done => {
    zip(interval(50), timeout(120, 2)).subscribe(value => {
      expect(value).toEqual([1, 2])
      done()
    })
  })
  test('有任意数据流完成且未发送数据立即触发完成', done => {
    let value = 1
    zip(new Observable(subscriber => {
      setTimeout(() => {
        subscriber.complete()
      })
    }), timeout(10, 2)).subscribe({
      next() {
        value = 2
      },
      complete() {
        expect(value).toBe(1)
        done()
      }
    })
  })
})
