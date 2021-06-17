import { Observable, Operator } from '../core/_api';

/**
 * 过滤源数据流，只发送返回为 true 时的数据
 * @param handle
 */
export function filter<T>(handle: (value: T) => boolean): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      return source.subscribe({
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
