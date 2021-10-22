import { Observable, of, switchMap } from '@tanbo/stream';

describe('switchMap', () => {
  test('确保以新的数据流为订阅结果', () => {
    const arr: any[] = []

    of(1, 2, 3).pipe(switchMap(value => {
      return new Observable(subscriber => {
        subscriber.next(value + 1)
      })
    })).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([2, 3, 4])
      }
    })
  })
})
