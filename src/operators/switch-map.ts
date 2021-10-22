import { Observable, Operator, PartialObserver, Subscription } from '../core/_api'

/**
 * 返回一个新的数据流，并以新数据流的订阅结果，发送出去
 * @param handle
 */
export function switchMap<T, U>(handle: (value: T) => Observable<U>): Operator<T, U> {
  return function (source: Observable<T>) {
    return new Observable<U>(subscriber => {
      let prev: Subscription;
      const obs: PartialObserver<T> = {
        next(value: T) {
          if (prev) {
            prev.unsubscribe();
          }
          prev = handle(value).subscribe({
            next(value2) {
              subscriber.next(value2)
            },
            error(err) {
              subscriber.error(err)
            },
            complete() {
              subscriber.complete()
            }
          })
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      }
      return source.subscribe(obs);
    })
  }
}
