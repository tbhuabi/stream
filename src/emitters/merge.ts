import { Observable } from '../core/_api';

/**
 * 监听多个数据流，当任意一个有新值时，均向后发送
 */
export function merge<T1>(s1: Observable<T1>): Observable<T1>;
export function merge<T1, T2>(s1: Observable<T1>, s2: Observable<T2>): Observable<T1 | T2>;
export function merge<T1, T2, T3>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>): Observable<T1 | T2 | T3>;
export function merge<T1, T2, T3, T4>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>): Observable<T1 | T2 | T3 | T4>;
export function merge<T1, T2, T3, T4, T5>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>): Observable<T1 | T2 | T3 | T4 | T5>;
export function merge<T1, T2, T3, T4, T5, T6>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>): Observable<T1 | T2 | T3 | T4 | T5 | T6>;
export function merge<T1, T2, T3, T4, T5, T6, T7>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7>;
export function merge<T1, T2, T3, T4, T5, T6, T7, T8>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>, s8: Observable<T8>): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
export function merge<T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>, s8: Observable<T8>, s9: Observable<T9>): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
export function merge<T>(...inputs: Observable<T>[]): Observable<T>;
export function merge(...inputs: Observable<any>[]): Observable<any>;
export function merge<T>(...inputs: Observable<T>[]): Observable<T> {
  return new Observable<T>(subscriber => {
    if (inputs.length === 0) {
      subscriber.complete();
    }
    const marks = inputs.map(i => {
      return {
        source: i,
        isComplete: false
      }
    })
    const subs = marks.map(s => {
      return s.source.subscribe({
        next(value) {
          subscriber.next(value)
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          s.isComplete = true;
          if (marks.every(i => i.isComplete)) {
            subscriber.complete();
          }
        }
      })
    })
    return function () {
      subs.forEach(i => i.unsubscribe());
    }
  })
}
