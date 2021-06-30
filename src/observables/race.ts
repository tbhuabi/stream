import { Observable, Subscription } from '../core/_api';

/**
 * 监听一组数据流，并发出最先到达的数据，然后忽略后面的值
 */
export function race<T1>(s1: Observable<T1>): Observable<T1>;
export function race<T1, T2>(s1: Observable<T1>, s2: Observable<T2>): Observable<T1 | T2>;
export function race<T1, T2, T3>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>): Observable<T1 | T2 | T3>;
export function race<T1, T2, T3, T4>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>): Observable<T1 | T2 | T3 | T4>;
export function race<T1, T2, T3, T4, T5>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>): Observable<T1 | T2 | T3 | T4 | T5>;
export function race<T1, T2, T3, T4, T5, T6>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>): Observable<T1 | T2 | T3 | T4 | T5 | T6>;
export function race<T1, T2, T3, T4, T5, T6, T7>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7>;
export function race<T1, T2, T3, T4, T5, T6, T7, T8>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>, s8: Observable<T8>): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>;
export function race<T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: Observable<T1>, s2: Observable<T2>, s3: Observable<T3>, s4: Observable<T4>, s5: Observable<T5>, s6: Observable<T6>, s7: Observable<T7>, s8: Observable<T8>, s9: Observable<T9>): Observable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
export function race<T>(...inputs: Observable<T>[]): Observable<T>;
export function race(...inputs: Observable<any>[]): Observable<any>;
export function race<T>(...inputs: Observable<T>[]): Observable<T> {
  return new Observable<T>(subscriber => {
    if (inputs.length === 0) {
      subscriber.complete();
      return;
    }
    let canPublish = true
    const subs: Subscription[] = [];
    for (const input of inputs) {
      if (!canPublish) {
        break;
      }
      subs.push(input.subscribe({
        next(value) {
          if (canPublish) {
            canPublish = false;
            subscriber.next(value);
            subscriber.complete();
          }
        },
        error(err) {
          if (canPublish) {
            subscriber.error(err);
          }
        },
        complete() {
          subs.forEach(i => i.unsubscribe());
          subscriber.complete();
        }
      }))
    }
    return function () {
      subs.forEach(i => i.unsubscribe());
    }
  })
}
