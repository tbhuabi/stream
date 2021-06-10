import { auditTime, of } from '@tanbo/stream';

describe('auditTime', () => {
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
})
