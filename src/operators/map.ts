import { Stream } from '../core/stream';
import { Operator } from '../core/help'

export function map<T, U>(handle: (value: T) => U): Operator<T, U> {
  return function (prevSteam: Stream<T>) {
    return new Stream<U>(observer => {
      const sub = prevSteam.subscribe({
        next(value: T) {
          observer.next(handle(value))
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