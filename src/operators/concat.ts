import { Operator, Stream, Subscription } from '../core/_api';

/**
 * 依次发送源值和一组数据流的值
 * @param inputs
 */
export function concat<T>(...inputs: Stream<T>[]): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      const streams = [prevSteam, ...inputs];

      let sub: Subscription;
      let isUnsubscribe = false;

      function toNext() {
        const stream = streams.shift();
        sub = stream.subscribe({
          next(value: T) {
            observer.next(value)
          },
          error(err?: Error) {
            observer.error(err);
          },
          complete() {
            if (isUnsubscribe) {
              return;
            }
            if (streams.length === 0) {
              observer.complete();
              return;
            }
            toNext();
          }
        })
        observer.onUnsubscribe(function () {
          isUnsubscribe = true;
          sub.unsubscribe()
        })
      }

      toNext();
    })
  }
}
