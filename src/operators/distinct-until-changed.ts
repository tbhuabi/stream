import { Operator, Stream } from '../core/_api';

/**
 * 过滤连续重复的值
 */
export function distinctUntilChanged<T>(): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    let lastValue: any = {};
    return new Stream<T>(subscriber => {
      return prevSteam.subscribe({
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
