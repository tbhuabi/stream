import { Stream, Operator } from '../core/_api'

/**
 * 将源数据流延迟一段时间再发送
 * @param time
 */
export function delay<T>(time: number): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      let timer: any;
      const sub = prevSteam.subscribe({
        next(v: T) {
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
