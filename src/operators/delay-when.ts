import { Observable, Operator, Subscription } from '../core/_api';

/**
 * 当前置 Observable 完成时，才发送之后产生的值
 * @param prerequisite
 */
export function delayWhen<T>(prerequisite: (value: T) => Observable<any>): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      const sub = new Subscription()
      const sub1 = source.subscribe({
        next(v: T) {
          sub.add(prerequisite(v).subscribe({
            complete() {
              subscriber.next(v)
            }
          }))
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          sub.unsubscribe()
          subscriber.complete()
        }
      })
      return function () {
        sub.unsubscribe()
        sub1.unsubscribe()
      }
    })
  }
}
