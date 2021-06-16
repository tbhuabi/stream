import { Stream } from '../core/_api';

/**
 * 将 Promise 转换为数据流
 * @param input
 */
export function fromPromise<T>(input: Promise<T>): Stream<T> {
  return new Stream<T>(subscriber => {
    input.then(v => {
      subscriber.next(v);
      subscriber.complete();
    }).catch(e => {
      subscriber.error(e);
    })
  })
}
