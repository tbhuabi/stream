import { Observable } from '../core/_api';

/**
 * 监听一组数据流，当所有数据到达时，将最新数据按输入顺序，以一个数组的形式发送并忽略后面的所有数据
 */
export function zip<T1>(s1: Observable<T1>): Observable<[T1]>;
export function zip<T1, T2>(s1: Observable<T1>, s2: Observable<T2>): Observable<[T1, T2]>;
export function zip<T1, T2, T3>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>): Observable<[T1, T2, T3]>;
export function zip<T1, T2, T3, T4>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>): Observable<[T1, T2, T3, T4]>;
export function zip<T1, T2, T3, T4, T5>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>): Observable<[T1, T2, T3, T4, T5]>;
export function zip<T1, T2, T3, T4, T5, T6>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>): Observable<[T1, T2, T3, T4, T5, T6]>;
export function zip<T1, T2, T3, T4, T5, T6, T7>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>): Observable<[T1, T2, T3, T4, T5, T6, T7]>;
export function zip<T1, T2, T3, T4, T5, T6, T7, T8>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>, s8: Observable<T8>): Observable<[T1, T2, T3, T4, T5, T6, T7, T8]>;
export function zip<T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>, s8: Observable<T8>, s9: Observable<T9>): Observable<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export function zip<T>(...inputs: Observable<T>[]): Observable<T[]>;
export function zip(...inputs: Observable<any>[]): Observable<any[]>;
export function zip<T>(...inputs: Observable<T>[]): Observable<T[]> {
  return new Observable<T[]>(subscriber => {
    if (inputs.length === 0) {
      subscriber.complete();
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
          subscriber.next(marks.map(j => j.value));
          subscriber.complete()
        }
      }, function (err) {
        subscriber.error(err);
      }, function () {
        if (subs && !config.hasMessage) {
          subs.forEach(i => i.unsubscribe());
          subscriber.complete();
        }
      })
    })
    if (isPublished) {
      subs.forEach(i => i.unsubscribe());
    }
  })
}
