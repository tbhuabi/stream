import { Observable, Operator } from '../core/_api'

/**
 * 忽略源值，并延迟一段时间，发送最新的值
 * @param time 要延迟的时间
 */
export function auditTime<T>(time: number): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      let canPublish = true
      let timer: any;
      let value: T;
      let isComplete = false
      let hasError = false
      const sub = source.subscribe({
        next(v: T) {
          value = v;
          if (canPublish) {
            canPublish = false;
            timer = setTimeout(() => {
              canPublish = true;
              subscriber.next(value)
              if (isComplete) {
                subscriber.complete();
              }
            }, time)
          }
        },
        error(err?: Error) {
          hasError = true
          if (sub) {
            sub.unsubscribe();
          }
          subscriber.error(err);
        },
        complete() {
          isComplete = true
        }
      })
      if (hasError) {
        sub.unsubscribe()
      }
      return function () {
        clearTimeout(timer);
        sub.unsubscribe()
      }
    })
  }
}
