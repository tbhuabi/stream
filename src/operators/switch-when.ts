import { Observable, Subscription, Operator } from '../core/_api'

/**
 * 当返回的 Observable 完成后，再切换下一个数据，直接所有数据流完成
 * @param callback
 */
export function switchWhen<T, U>(callback: (data: T) => Observable<U>): Operator<T, U> {
  return function (source: Observable<T>) {
    const cache: T[] = []
    let next: Subscription | null = null
    let canToNext = true
    let isCompleted = false
    return new Observable<U>(subscriber => {
      function toNext() {
        if (!canToNext) {
          return
        }
        const value = cache.shift()
        if (!value) {
          if (isCompleted) {
            subscriber.complete()
          }
          return
        }
        canToNext = false
        next = callback(value).subscribe({
          next(nextValue: U) {
            subscriber.next(nextValue)
            if (canToNext) {
              next = null
              toNext()
            }
          },
          error(e) {
            subscriber.error(e)
          },
          complete() {
            canToNext = true
            next = null
            toNext()
          }
        })
      }

      const subscription = source.subscribe({
        next(value: T) {
          cache.push(value)
          toNext()
        },
        error(e) {
          subscriber.error(e)
        },
        complete() {
          isCompleted = true
          toNext()
        }
      })

      return () => {
        subscription.unsubscribe()
        next?.unsubscribe()
      }
    })
  }
}
