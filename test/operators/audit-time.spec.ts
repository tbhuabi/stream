import { auditTime, interval, of } from '@tanbo/stream';

describe('auditTime', () => {
  test('单位时间内只触发一次', done => {
    let count = 0
    of(1, 2, 3).pipe(auditTime(10)).subscribe({
      next() {
        count++;
      },
      complete() {
        expect(count).toBe(1)
        done()
      }
    })
  })
  test('获取时间内最新值', done => {
    let value: number
    of(1, 2, 3).pipe(auditTime(10)).subscribe({
      next(v) {
        value = v;
      },
      complete() {
        expect(value).toBe(3)
        done()
      }
    })
  })

  test('间隔单位时间发送最新值', done => {
    const arr = []
    const sub = interval(10).pipe(auditTime(20)).subscribe({
      next(v) {
        arr.push(v);
      }
    })
    setTimeout(() => {
      sub.unsubscribe()
      expect(arr).toEqual([1, 3, 5, 7])
      done()
    }, 110)
  })
})
