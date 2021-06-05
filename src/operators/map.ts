import { Stream, Operator } from '../core/_api'

/**
 * 将源数据转换成另外一种数据，再发送出去
 * @param handle 转换函数
 */
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
