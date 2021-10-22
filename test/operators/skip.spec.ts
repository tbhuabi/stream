import { of, skip } from '@tanbo/stream';

describe('skip', () => {
  test('确保跳过指定次数的数据', () => {
    const arr: any[] = []
    of(1, 2, 3, 4, 5).pipe(skip(2)).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([3, 4, 5])
      }
    })
  })
})
