import { of, tap } from '@tanbo/stream';

describe('tap', () => {
  test('确保副作用生效', () => {
    let i = 0
    of(1, 2, 3).pipe(tap(() => {
      i++
    })).subscribe({
      complete() {
        expect(i).toBe(3)
      }
    })
  })
})
