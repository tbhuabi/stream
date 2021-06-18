import { map, of } from '@tanbo/stream';

describe('map', () => {
  test('确保以变换后的数据发送', () => {
    const arr = []
    of(1, 2, 3).pipe(map(v => {
      return v + ''
    })).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual(['1', '2', '3'])
      }
    })
  })
})
