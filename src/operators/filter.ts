import { Stream, Operator } from '../core/_api';

/**
 * 过滤源数据流，只发送返回为 true 时的数据
 * @param handle
 */
export function filter<T>(handle: (value: T) => boolean): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(subscriber => {
      return prevSteam.subscribe({
        next(value: T) {
          if (handle(value)) {
            subscriber.next(value)
          }
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      })
    })
  }
}
