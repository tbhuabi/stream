import { Observable } from '../core/_api';

/**
 * 创建一个马上完成的可观察对象
 */
export function empty() {
  return new Observable(subscriber => {
    subscriber.complete()
  })
}
