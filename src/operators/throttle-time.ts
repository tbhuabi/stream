import { Stream, Operator } from '../core/_api'

/**
 * 发出最先到达的值，并忽略一段时间内的新值，然后再发送时间到达之后最新到达的值
 * @param time
 */
export function throttleTime<T>(time: number): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(subscriber => {
      let canPublish = true
      let timer: any;
      const sub = prevSteam.subscribe({
        next(v: T) {
          if (canPublish) {
            canPublish = false;
            subscriber.next(v)
            timer = setTimeout(() => {
              canPublish = true;
            }, time)
          }
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      })
      return function () {
        clearTimeout(timer);
        sub.unsubscribe()
      }
    })
  }
}
