import { Operator, Observable } from '../core/_api';

/**
 * 过滤连续重复的值
 */
export function distinctUntilChanged<T>(comparator?: (previous: T, current: T) => unknown): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      let lastValue: any = {};
      let isFirst = true
      return source.subscribe({
        next(value: T) {
          if (isFirst) {
            isFirst = false
            lastValue = value
            subscriber.next(value)
            return
          }
          if (comparator) {
            const b = comparator(lastValue, value)
            lastValue = value
            if (b) {
              subscriber.next(value)
            }
          } else if (value !== lastValue) {
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
