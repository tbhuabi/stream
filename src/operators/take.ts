import { Operator, PartialObserver, Observable } from '../core/_api';

/**
 * 指定源数据流最多发送几次
 * @param count
 */
export function take<T>(count: number): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      let i = 0;
      const obs: PartialObserver<T> = {
        next(value) {
          if (i < count) {
            subscriber.next(value);
            i++;
            if (i === count) {
              subscriber.complete();
            }
            return;
          }
          subscriber.complete();
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      }
      return source.subscribe(obs);
    })
  }
}
