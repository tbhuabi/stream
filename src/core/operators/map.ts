import { Operator, Stream } from '../stream';

export function map<T, U>(handle: (value: T) => U): Operator<T, U> {
  return function (prevSteam: Stream<T>) {
    return new Stream<U>(publisher => {
      const sub = prevSteam.listen({
        next(value: T) {
          publisher.next(handle(value))
        },
        error(err?: Error) {
          publisher.error(err);
        },
        complete() {
          publisher.complete();
        }
      })
      publisher.onUnListen(function () {
        sub.unListen()
      })
    })
  }
}
