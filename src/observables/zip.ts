import { Observable, Subscription } from '../core/_api';

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
export function zip<T>(...inputs: Observable<T>[]): any {
  return new Observable<T[]>(subscriber => {
    if (inputs.length === 0) {
      subscriber.complete();
      return;
    }
    const marks = inputs.map(source => {
      return {
        source,
        values: [] as T[],
        isComplete: false
      }
    })
    const subscription = new Subscription()

    function handleComplete() {
      for (const i of marks) {
        if (i.isComplete && i.values.length === 0) {
          subscriber.complete()
          subscription.unsubscribe()
          break
        }
      }
    }

    marks.forEach((config) => {
      subscription.add(config.source.subscribe({
        next(value) {
          const values = config.values
          values.push(value)
          if (marks.every(i => i.values.length)) {
            subscriber.next(marks.map(item => {
              return item.values.shift()!
            }))
            handleComplete()
          }
        },
        error(err: any) {
          subscriber.error(err)
        },
        complete() {
          config.isComplete = true
          handleComplete()
        }
      }))
    })
    return subscription
  })
}
