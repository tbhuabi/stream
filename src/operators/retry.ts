import { Observable, Operator } from '../core/_api';

/**
 * 当数据源发生错误时，重新尝试订阅
 * @param count
 */
export function retry<T>(count: number): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable(subscriber => {
      let i = 0
      let hasError = false

      function subscribe() {
        return source.subscribe({
          next(value: T) {
            subscriber.next(value)
          },
          error(err: any) {
            if (i < count) {
              i++
              subscription = subscribe()
            } else {
              hasError = true
              subscriber.error(err)
            }
          },
          complete() {
            subscriber.complete()
          }
        })
      }

      let subscription = subscribe()
      if (hasError) {
        subscription.unsubscribe()
      }
      return function () {
        subscription.unsubscribe()
      }
    })
  }
}
