import { Observable } from '../core/_api';

/**
 * 创建一个发出错误的可观察对象
 * @param err
 */
export function throwError<T extends Error>(err?: T) {
  return new Observable(subscriber => {
    subscriber.error(err || new Error())
  })
}
