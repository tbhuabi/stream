import { Observable } from '../core/_api';

/**
 * 将任意数据转换为数据流发送
 */
export function of<T1>(s1: T1): Observable<T1>;
export function of<T1, T2>(s1: T1, s2: T2): Observable<T1 | T2>;
export function of<T1, T2, T3>(s1: T1, s2: T2, s3: T3): Observable<T1 | T2 | T3>;
export function of<T1, T2, T3, T4>(s1: T1, s2: T2, s3: T3, s4: T4): Observable<T1 | T2 | T3 | T4>;
export function of<T1, T2, T3, T4, T5>(s1: T1, s2: T2, s3: T3, s4: T4, s5: T5): Observable<T1 | T2 | T3 | T4 | T5>;
export function of<T1, T2, T3, T4, T5, T6>(s1: T1, s2: T2, s3: T3, s4: T4, s5: T5, s6: T6): Observable<T1 | T2 | T3 | T4 | T5 | T6>;
export function of<T1, T2, T3, T4, T5, T6, T7>(s1: T1, s2: T2, s3: T3, s4: T4, s5: T5, s6: T6, s7: T7): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7>;
export function of<T1, T2, T3, T4, T5, T6, T7, T8>(s1: T1, s2: T2, s3: T3, s4: T4, s5: T5, s6: T6, s7: T7, s8: T8): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
export function of<T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: T1, s2: T2, s3: T3, s4: T4, s5: T5, s6: T6, s7: T7, s8: T8, s9: T9): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
export function of<T>(...data: T[]): Observable<T>;
export function of(...data: any[]): Observable<any>;
export function of<T>(...data: T[]): Observable<T> {
  return new Observable<T>(subscriber => {
    data.forEach(i => subscriber.next(i));
    subscriber.complete()
  })
}
