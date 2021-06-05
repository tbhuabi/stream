import { Stream, Operator } from '../core/_api'

/**
 * 忽略源值，并延迟一段时间，发送最新的值
 * @param time 要延迟的时间
 */
export function auditTime<T>(time: number): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      let canPublish = false
      let timer: any;
      let value: T;
      const sub = prevSteam.subscribe({
        next(v: T) {
          value = v;
          if (!canPublish) {
            canPublish = true;
            timer = setTimeout(() => {
              canPublish = false;
              observer.next(value)
            }, time)
          }
        },
        error(err?: Error) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        }
      })
      observer.onUnsubscribe(function () {
        clearTimeout(timer);
        sub.unsubscribe()
      })
    })
  }
}
