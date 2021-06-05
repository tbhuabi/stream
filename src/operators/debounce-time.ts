import { Stream, Operator } from '../core/_api'

/**
 * 在一段时间内，没有新值时，才发送最新的值
 * @param time
 */
export function debounceTime<T>(time: number): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      let timer: any;
      const sub = prevSteam.subscribe({
        next(v: T) {
          clearTimeout(timer);
          timer = setTimeout(function () {
            observer.next(v);
          }, time);
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
