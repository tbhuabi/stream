import { Stream } from '../core/stream';
import { Operator } from '../core/help'

export function filter<T>(handle: (value: T) => boolean): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      const sub = prevSteam.subscribe({
        next(value: T) {
          if (handle(value)) {
            observer.next(value)
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
        sub.unsubscribe()
      })
    })
  }
}
