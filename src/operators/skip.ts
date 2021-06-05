import { Operator, PartialObserver, Stream } from '../core/_api';

/**
 * 跳过指定次数的数据，然后发送后面的值
 * @param count 要跳过的次数
 */
export function skip<T>(count: number): Operator<T, T> {
  return function (prevStream: Stream<T>) {
    let i = 0;
    return new Stream<T>(observer => {
      const subscribe: PartialObserver<T> = {
        next(value) {
          if (i < count) {
            i++;
            return;
          }
          observer.next(value);
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          sub.unsubscribe();
          observer.complete();
        }
      }
      const sub = prevStream.subscribe(subscribe);
    })
  }
}
