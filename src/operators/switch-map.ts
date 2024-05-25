import { Observable, Operator, PartialObserver, Subscription } from '../core/_api'

/**
 * 返回一个新的数据流，并以新数据流的订阅结果，发送出去
 * @param handle
 */
export function switchMap<T, U>(handle: (value: T) => Observable<U>): Operator<T, U> {
  return function (source: Observable<T>) {
    return new Observable<U>(subscriber => {
      let isComplete = false
      let sub: Subscription | null = null
      const obs: PartialObserver<T> = {
        next(value: T) {
          if (sub) {
            sub.unsubscribe()
          }
          sub = handle(value).subscribe({
            next(value2) {
              subscriber.next(value2)
              if (isComplete) {
                subscriber.complete()
              }
            },
            error(err) {
              subscriber.error(err)
            }
          })
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          isComplete = true
        }
      }
      return source.subscribe(obs)
    })
  }
}
