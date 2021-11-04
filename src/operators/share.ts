import { Observable, Operator, Subject } from '../core/_api'

/**
 * 让多个订阅共享同一个数据源，而不是创建新的
 */
export function share<T>(): Operator<T, T> {
  return function (source: Observable<T>) {
    const subject = new Subject<T>()
    source.subscribe({
      next(value: T) {
        subject.next(value)
      },
      error(err: Error) {
        subject.error(err);
      },
      complete() {
        subject.complete();
      }
    })
    return subject
  }
}
