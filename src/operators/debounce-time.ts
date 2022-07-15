import { Observable, Operator } from '../core/_api'

/**
 * 在一段时间内，没有新值时，才发送最新的值
 * @param time
 */
export function debounceTime<T>(time: number): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      let timer: any = null;
      let isComplete = false
      const sub = source.subscribe({
        next(v: T) {
          clearTimeout(timer);
          timer = setTimeout(function () {
            timer = null
            subscriber.next(v);
            if (isComplete) {
              subscriber.complete()
            }
          }, time);
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          if (timer === null) {
            subscriber.complete();
          } else {
            isComplete = true
          }
        }
      })
      return function () {
        timer = null
        clearTimeout(timer);
        sub.unsubscribe()
      }
    })
  }
}
