import { Stream, Operator, PartialObserver } from '../core/_api'

export function switchMap<T, U>(handle: (value: T) => Stream<U>): Operator<T, U> {
  return function (prevSteam: Stream<T>) {
    return new Stream<U>(observer => {
      const subscriber: PartialObserver<T> = {
        next(value: T) {
          handle(value).subscribe(value2 => {
            observer.next(value2);
          }, err => {
            subscriber.error(err)
          })
        },
        error(err?: Error) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        }
      }
      const sub = prevSteam.subscribe(subscriber);
      observer.onUnsubscribe(function () {
        sub.unsubscribe()
      })
    })
  }
}
