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
  test('获取时间内初始值', done => {
    let value: number
    of(1, 2, 3).pipe(auditTime(10)).subscribe({
      next(v) {
        value = v;
      },
      complete() {
        expect(value).toBe(1)
        done()
      }
    })
  })

  test('间隔单位时间发送最新值', done => {
    const arr: any[] = []
    const sub = interval(10).pipe(auditTime(20)).subscribe({
      next(v) {
        arr.push(v);
      }
    })
    setTimeout(() => {
      sub.unsubscribe()
      expect(arr).toEqual([0, 2, 4, 6])
      done()
    }, 110)
  })
})
