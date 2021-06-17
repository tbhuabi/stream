import { Observable, Operator } from '../core/_api'

/**
 * 在数据流中添加副作用
 * @param callback 副作用函数
 */
export function tap<T>(callback: () => void): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      return source.subscribe({
        next(v: T) {
          callback()
          subscriber.next(v);
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
