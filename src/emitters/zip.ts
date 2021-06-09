import { Stream } from '../core/_api';

/**
 * 监听一组数据流，当所有数据到达时，将最新数据按输入顺序，以一个数组的形式发送并忽略后面的所有数据
 */
export function zip<T1>(s1: Stream<T1>): Stream<[T1]>;
export function zip<T1, T2>(s1: Stream<T1>, s2: Stream<T2>): Stream<[T1, T2]>;
export function zip<T1, T2, T3>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>): Stream<[T1, T2, T3]>;
export function zip<T1, T2, T3, T4>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>): Stream<[T1, T2, T3, T4]>;
export function zip<T1, T2, T3, T4, T5>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>): Stream<[T1, T2, T3, T4, T5]>;
export function zip<T1, T2, T3, T4, T5, T6>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>): Stream<[T1, T2, T3, T4, T5, T6]>;
export function zip<T1, T2, T3, T4, T5, T6, T7>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>): Stream<[T1, T2, T3, T4, T5, T6, T7]>;
export function zip<T1, T2, T3, T4, T5, T6, T7, T8>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>, s8: Stream<T8>): Stream<[T1, T2, T3, T4, T5, T6, T7, T8]>;
export function zip<T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: Stream<T1>, s2: Stream<T2>, s3: Stream<T3>, s4: Stream<T4>, s5: Stream<T5>, s6: Stream<T6>, s7: Stream<T7>, s8: Stream<T8>, s9: Stream<T9>): Stream<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export function zip<T>(...inputs: Stream<T>[]): Stream<T[]>;
export function zip(...inputs: Stream<any>[]): Stream<any[]>;
export function zip<T>(...inputs: Stream<T>[]): Stream<T[]> {
  return new Stream<T[]>(observer => {
    if (inputs.length === 0) {
      observer.complete();
      return;
    }
    const marks = inputs.map(i => {
      return {
        source: i,
        hasMessage: false,
        value: null
      }
    });

    let isPublished = false;
    const subs = marks.map(config => {
      return config.source.subscribe(value => {
        config.value = value;
        config.hasMessage = true;
        if (marks.every(o => o.hasMessage)) {
          isPublished = true;
          if (subs) {
            subs.forEach(i => i.unsubscribe());
          }
          observer.next(marks.map(j => j.value));
          observer.complete()
        }
      }, function (err) {
        observer.error(err);
      }, function () {
        if (subs && !config.hasMessage) {
          subs.forEach(i => i.unsubscribe());
          observer.complete();
        }
      })
    })
    if (isPublished) {
      subs.forEach(i => i.unsubscribe());
    }
  })
}
