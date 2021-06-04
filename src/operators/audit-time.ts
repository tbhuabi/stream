import { Stream, Operator } from '../core/_api'

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
