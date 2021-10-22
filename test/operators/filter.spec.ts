import { filter, of } from '@tanbo/stream';

describe('filter', () => {
  test('确保过滤条件为 false 的值', () => {
    const arr: any[] = []
    of(8, 1, 5, 2, 3, 7, 9, 4, 6).pipe(filter(value => {
      return value > 5
    })).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([8, 7, 9, 6])
      }
    })
  })
})
