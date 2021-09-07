import { of } from '@tanbo/stream';

describe('of', () => {
  test('依次发送参数内的值', () => {
    const arr = []
    of(1, 2).subscribe(value => {
      arr.push(value)
    })
    expect(arr).toEqual([1, 2])
  })
  test('发送完成立即触发结束', () => {
    const arr = []
    of(1, 2).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([1, 2])
      }
    })
  })
})
