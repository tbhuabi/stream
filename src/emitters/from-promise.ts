import { Stream } from '../core/_api';

/**
 * 将 Promise 转换为数据流
 * @param input
 */
export function fromPromise<T>(input: Promise<T>): Stream<T> {
  return new Stream<T>(observer => {
    input.then(v => {
      observer.next(v);
      observer.complete();
    }).catch(e => {
      observer.error(e);
    })
  })
}
