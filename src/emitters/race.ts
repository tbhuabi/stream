import { Stream } from '../core/_api';

/**
 * 监听一组数据流，并发出最先到达的数据，然后忽略后面的值，当所有数据
 * 流都有新数据时，重置状态并重新发送最先到达的数据
 */
export function race<T1>(s1: Stream<T1>): Stream<T1>;
export function race<T1, T2>(s1: Stream<T1>, s2: Stream<T2>): Stream<T1 | T2>;
export function race<T1, T2, T3>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>): Stream<T1 | T2 | T3>;
export function race<T1, T2, T3, T4>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>): Stream<T1 | T2 | T3 | T4>;
export function race<T1, T2, T3, T4, T5>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>): Stream<T1 | T2 | T3 | T4 | T5>;
export function race<T1, T2, T3, T4, T5, T6>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>): Stream<T1 | T2 | T3 | T4 | T5 | T6>;
export function race<T1, T2, T3, T4, T5, T6, T7>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>): Stream<T1 | T2 | T3 | T4 | T5 | T6 | T7>;
export function race<T1, T2, T3, T4, T5, T6, T7, T8>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>, s8: Stream<T8>): Stream<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
export function race<T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>, s8: Stream<T8>, s9: Stream<T9>): Stream<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
export function race<T>(...inputs: Stream<T>[]): Stream<T>;
export function race(...inputs: Stream<any>[]): Stream<any>;
export function race<T>(...inputs: Stream<T>[]): Stream<T> {
  return new Stream<T>(observer => {
    if (inputs.length === 0) {
      observer.complete();
      return;
    }
    let canPublish = true
    const marks = inputs.map(i => {
      return {
        source: i,
        hasMessage: false,
      }
    });

    const subs = marks.map(i => {
      return i.source.subscribe(value => {
        i.hasMessage = true;
        if (canPublish) {
          observer.next(value);
          canPublish = false;
        }
        if (marks.every(o => !o.hasMessage)) {
          marks.forEach(j => j.hasMessage = false);
          canPublish = true;
        }
      }, function (err) {
        observer.error(err);
      }, function () {
        subs.forEach(i => i.unsubscribe());
        observer.complete();
      })
    })
  })
}
