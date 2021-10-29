import { Observable } from '../core/_api';

/**
 * 延迟一段时间发送数据
 * @param delay 要延迟的时间
 * @param data 要发送的值
 */
export function timeout<T>(delay = 1000, data: T = (0 as any)) {
  return new Observable<T>(subscriber => {
    const timer = setTimeout(function () {
      subscriber.next(data);
      subscriber.complete();
    }, delay)
    return function () {
      clearTimeout(timer);
    }
  })
}
