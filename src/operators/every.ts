import { Observable, Operator } from '../core/_api';

/**
 * 当所有数据都满足条件时，才发送 true
 * @param test
 */
export function every<T>(test: (value: T) => unknown): Operator<T, boolean> {
  return function (source: Observable<T>) {
    return new Observable(subscriber => {
      const sub = source.subscribe({
        next(value: T) {
          const b = test(value)
          if (!b) {
            subscriber.next(false)
            subscriber.complete()
            sub.unsubscribe()
          }
        },
        error(err: any) {
          subscriber.error(err)
        },
        complete() {
          subscriber.next(true)
          subscriber.complete()
        }
      })
      return sub
    })
  }
}
