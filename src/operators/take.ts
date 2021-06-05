import { Operator, PartialObserver, Stream } from '../core/_api';

/**
 * 指定源数据流最多发送几次
 * @param count
 */
export function take<T>(count: number): Operator<T, T> {
  return function (prevStream: Stream<T>) {
    let i = 0;
    return new Stream<T>(observer => {
      const subscribe: PartialObserver<T> = {
        next(value) {
          if (i < count) {
            observer.next(value);
            i++;
            if (i === count) {
              subscribe.complete();
            }
            return;
          }
          subscribe.complete();
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
      observer.onUnsubscribe(() => {
        sub.unsubscribe();
      })
    })
  }
}
