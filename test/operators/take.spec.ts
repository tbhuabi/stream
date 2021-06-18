import { of, take } from '@tanbo/stream';

describe('take', () => {
  test('指定源数据最多发送几次', () => {
    const arr = []
    of(1, 2, 3, 4).pipe(take(2)).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([1, 2])
      }
    })
  })
})
