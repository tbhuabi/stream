import { Operator, Observable, Subscription } from '../core/_api';

/**
 * 依次发送源值和一组数据流的值
 */
export function concat<T, T1>(s1: Observable<T1>): Operator<T, T | T1>;
export function concat<T, T1, T2>(s1: Observable<T1>, s2: Observable<T2>): Operator<T, T | T1 | T2>;
export function concat<T, T1, T2, T3>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>): Operator<T, T | T1 | T2 | T3>;
export function concat<T, T1, T2, T3, T4>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>): Operator<T, T | T1 | T2 | T3 | T4>;
export function concat<T, T1, T2, T3, T4, T5>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>): Operator<T, T | T1 | T2 | T3 | T4 | T5>;
export function concat<T, T1, T2, T3, T4, T5, T6>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>): Operator<T, T | T1 | T2 | T3 | T4 | T5 | T6>;
export function concat<T, T1, T2, T3, T4, T5, T6, T7>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>): Operator<T, T | T1 | T2 | T3 | T4 | T5 | T6 | T7>;
export function concat<T, T1, T2, T3, T4, T5, T6, T7, T8>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>, s8: Observable<T8>): Operator<T, T | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
export function concat<T, T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>, s8: Observable<T8>, s9: Observable<T9>): Operator<T, T | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
export function concat<T>(...inputs: Observable<T>[]): Operator<T, T>;
export function concat<T>(...inputs: Observable<any>[]): Operator<T, T | any>;
export function concat<T>(...inputs: Observable<T>[]): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      const streams = [source, ...inputs];

      let sub: Subscription;
      let isUnsubscribe = false;

      function toNext() {
        const stream = streams.shift()!;
        sub = stream.subscribe({
          next(value: T) {
            subscriber.next(value)
          },
          error(err?: Error) {
            subscriber.error(err);
          },
          complete() {
            if (isUnsubscribe) {
              return;
            }
            if (streams.length === 0) {
              subscriber.complete();
              return;
            }
            toNext();
          }
        })
      }
      toNext();
      return function () {
        isUnsubscribe = true;
        sub.unsubscribe()
      }
    })
  }
}
