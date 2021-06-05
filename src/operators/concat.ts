import { Operator, Stream, Subscription } from '../core/_api';

/**
 * 依次发送源值和一组数据流的值
 */
export function concat<T, T1>(s1: Stream<T1>): Operator<T, T | T1>;
export function concat<T, T1, T2>(s1: Stream<T1>, s2: Stream<T2>): Operator<T, T | T1 | T2>;
export function concat<T, T1, T2, T3>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>): Operator<T, T | T1 | T2 | T3>;
export function concat<T, T1, T2, T3, T4>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>): Operator<T, T | T1 | T2 | T3 | T4>;
export function concat<T, T1, T2, T3, T4, T5>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>): Operator<T, T | T1 | T2 | T3 | T4 | T5>;
export function concat<T, T1, T2, T3, T4, T5, T6>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>): Operator<T, T | T1 | T2 | T3 | T4 | T5 | T6>;
export function concat<T, T1, T2, T3, T4, T5, T6, T7>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>): Operator<T, T | T1 | T2 | T3 | T4 | T5 | T6 | T7>;
export function concat<T, T1, T2, T3, T4, T5, T6, T7, T8>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>, s8: Stream<T8>): Operator<T, T | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
export function concat<T, T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>, s8: Stream<T8>, s9: Stream<T9>): Operator<T, T | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
export function concat<T>(...inputs: Stream<any>[]): Operator<T, T> {
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
