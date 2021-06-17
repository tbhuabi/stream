import { Stream, Operator, PartialObserver } from '../core/_api'

/**
 * 返回一个新的数据流，并以新数据流的订阅结果，发送出去
 * @param handle
 */
export function switchMap<T, U>(handle: (value: T) => Stream<U>): Operator<T, U> {
  return function (source: Stream<T>) {
    return new Stream<U>(subscriber => {
      const obs: PartialObserver<T> = {
        next(value: T) {
          handle(value).subscribe(value2 => {
            subscriber.next(value2);
          }, function (err) {
            obs.error(err)
          }, function () {
            if (sub) {
              sub.unsubscribe();
            }
            obs.complete()
          })
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      }
      const sub = source.subscribe(obs);
      return sub;
    })
  }
}
