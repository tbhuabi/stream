import { concat, of, timeout } from '@tanbo/stream';

describe('concat', () => {
  test('依次发送多个数据源', () => {
    const arr = []
    of(1).pipe(concat(of(2), of(3))).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([1, 2, 3])
      }
    })
  })

  test('等待异步初始数据源发送再发送其它数据源', done => {
    const arr = []
    timeout(10, 1).pipe(concat(of(2), of(3))).subscribe({
      next(v) {
        arr.push(v)
      },
      complete() {
        expect(arr).toEqual([1, 2, 3])
        done()
      }
    })
  })
  test('等待传入的异步数据源发送完成再发送其它数据源', done => {
    const arr = []
    timeout(10, 1).pipe(concat(timeout(10, 2), of(3))).subscribe({
      next(v) {
        arr.push(v)
      },
      complete() {
        expect(arr).toEqual([1, 2, 3])
        done()
      }
    })
  })
})
