import { Stream, Operator } from '../core/_api';

/**
 * 过滤源数据流，只发送返回为 true 时的数据
 * @param handle
 */
export function filter<T>(handle: (value: T) => boolean): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      const sub = prevSteam.subscribe({
        next(value: T) {
          if (handle(value)) {
            observer.next(value)
          }
        },
        error(err?: Error) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        }
      })
      observer.onUnsubscribe(function () {
        sub.unsubscribe()
      })
    })
  }
}
