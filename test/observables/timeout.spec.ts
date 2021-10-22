import { timeout } from '@tanbo/stream';

describe('timeout', () => {
  test('只发送一个值且立即结束', done => {
    const arr: any[] = []
    timeout(1).subscribe({
      next() {
        arr.push(1)
      },
      complete() {
        expect(arr).toEqual([1])
        done()
      }
    })
  })
  test('取消订阅后不再发送', done => {
    const arr: any[] = []
    const sub = timeout(1, 1).subscribe({
      next(v) {
        arr.push(v)
      }
    })
    sub.unsubscribe()
    setTimeout(() => {
      expect(arr.length).toBe(0)
      done()
    }, 10)
  })
  test('发送指定的值', done => {
    let value: any
    timeout(1, 10).subscribe({
      next(v) {
        value = v
      }
    })
    setTimeout(() => {
      expect(value).toBe(10)
      done()
    }, 10)
  })
})
