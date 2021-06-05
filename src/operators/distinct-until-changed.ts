import { Operator, Stream } from '../core/_api';

/**
 * 过滤连续重复的值
 */
export function distinctUntilChanged<T>(): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    let lastValue: any = {};
    return new Stream<T>(observer => {
      const sub = prevSteam.subscribe({
        next(value: T) {
          if (value !== lastValue) {
            lastValue = value;
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
