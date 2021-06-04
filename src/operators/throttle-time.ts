import { Stream, Operator } from '../core/_api'

export function throttleTime<T>(time: number): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      let canPublish = true
      let timer: any;
      let value: T;
      const sub = prevSteam.subscribe({
        next(v: T) {
          value = v;
          if (canPublish) {
            canPublish = false;
            observer.next(value)
            timer = setTimeout(() => {
              canPublish = true;
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
