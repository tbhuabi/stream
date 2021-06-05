import { Stream, Operator, PartialObserver } from '../core/_api'

/**
 * 返回一个新的数据流，并以新数据流的订阅结果，发送出去
 * @param handle
 */
export function switchMap<T, U>(handle: (value: T) => Stream<U>): Operator<T, U> {
  return function (prevSteam: Stream<T>) {
    return new Stream<U>(observer => {
      const subscriber: PartialObserver<T> = {
        next(value: T) {
          handle(value).subscribe(value2 => {
            observer.next(value2);
          }, function (err) {
            subscriber.error(err)
          }, function () {
            if (sub) {
              sub.unsubscribe();
            }
            subscriber.complete()
          })
        },
        error(err?: Error) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        }
      }
      const sub = prevSteam.subscribe(subscriber);
      observer.onUnsubscribe(function () {
        sub.unsubscribe()
      })
    })
  }
}
