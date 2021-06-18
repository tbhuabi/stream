import { Operator, PartialObserver, Observable } from '../core/_api';

/**
 * 跳过指定次数的数据，然后发送后面的值
 * @param count 要跳过的次数
 */
export function skip<T>(count: number): Operator<T, T> {
  return function (source: Observable<T>) {
    let i = 0;
    return new Observable<T>(subscriber => {
      const subscribe: PartialObserver<T> = {
        next(value) {
          if (i < count) {
            i++;
            return;
          }
          subscriber.next(value);
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      }
      return source.subscribe(subscribe);
    })
  }
}
