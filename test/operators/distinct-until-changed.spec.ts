import { distinctUntilChanged, of } from '@tanbo/stream';

describe('distinctUntilChanged', () => {
  test('确保过滤连续重复的值', () => {
    const arr: any[] = []
    of(1, 2, 3, 3, 2, 4, 4).pipe(distinctUntilChanged()).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([1, 2, 3, 2, 4])
      }
    })
  })
})
