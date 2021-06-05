import { Stream, Operator } from '../core/_api'

/**
 * 在数据流中添加副作用
 * @param callback 副作用函数
 */
export function tap<T>(callback: () => void): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      const sub = prevSteam.subscribe({
        next(v: T) {
          callback()
          observer.next(v);
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
