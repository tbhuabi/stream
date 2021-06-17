import { Observable, Operator } from '../core/_api'

/**
 * 将源数据流延迟一段时间再发送
 * @param time
 */
export function delay<T>(time = 0): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      let timers: any[] = [];
      let isComplete = false;
      const sub = source.subscribe({
        next(v: T) {
          timers.push(setTimeout(function () {
            timers.shift()
            subscriber.next(v);
            if (isComplete && timers.length === 0) {
              subscriber.complete();
            }
          }, time));
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          isComplete = true
        }
      })
      return function () {
        timers.forEach(i => clearTimeout(i));
        sub.unsubscribe()
      }
    })
  }
}
