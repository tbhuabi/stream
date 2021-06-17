import { Operator, Observable } from '../core/_api';

/**
 * 过滤连续重复的值
 */
export function distinctUntilChanged<T>(): Operator<T, T> {
  return function (source: Observable<T>) {
    let lastValue: any = {};
    return new Observable<T>(subscriber => {
      return source.subscribe({
        next(value: T) {
          if (value !== lastValue) {
            lastValue = value;
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
