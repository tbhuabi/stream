import { Observable, Operator } from '../core/_api'

/**
 * 将源数据转换成另外一种数据，再发送出去
 * @param handle 转换函数
 */
export function map<T, U>(handle: (value: T) => U): Operator<T, U> {
  return function (source: Observable<T>) {
    return new Observable<U>(subscriber => {
      return source.subscribe({
        next(value: T) {
          subscriber.next(handle(value))
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      })
    })
  }
}
