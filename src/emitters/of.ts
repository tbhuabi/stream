import { Stream } from '../core/_api';

/**
 * 将任意数据转换为数据流发送
 * @param data
 */
export function of<T>(...data: T[]): Stream<T> {
  return new Stream<T>(observer => {
    data.forEach(i => observer.next(i));
    observer.complete()
  })
}
