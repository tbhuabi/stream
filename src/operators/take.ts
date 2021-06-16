import { Operator, PartialObserver, Stream } from '../core/_api';

/**
 * 指定源数据流最多发送几次
 * @param count
 */
export function take<T>(count: number): Operator<T, T> {
  return function (prevStream: Stream<T>) {
    let i = 0;
    return new Stream<T>(subscriber => {
      const obs: PartialObserver<T> = {
        next(value) {
          if (i < count) {
            subscriber.next(value);
            i++;
            if (i === count) {
              obs.complete();
            }
            return;
          }
          obs.complete();
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          sub.unsubscribe();
          subscriber.complete();
        }
      }
      const sub = prevStream.subscribe(obs);
      return sub;
    })
  }
}
