import { Stream, Operator } from '../core/_api'

/**
 * 将源数据流延迟一段时间再发送
 * @param time
 */
export function delay<T>(time = 0): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      let timers: any[] = [];
      let isComplete = false;
      const sub = prevSteam.subscribe({
        next(v: T) {
          timers.push(setTimeout(function () {
            timers.shift()
            observer.next(v);
            if (isComplete && timers.length === 0) {
              observer.complete();
            }
          }, time));
        },
        error(err?: Error) {
          observer.error(err);
        },
        complete() {
          isComplete = true
        }
      })
      observer.onUnsubscribe(function () {
        timers.forEach(i => clearTimeout(i));
        sub.unsubscribe()
      })
    })
  }
}
