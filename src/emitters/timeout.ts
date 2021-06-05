import { Stream } from '../core/_api';

/**
 * 延迟一段时间发送数据
 * @param delay 要延迟的时间
 * @param data 要发送的值
 */
export function timeout<T>(delay = 1000, data?: T) {
  return new Stream<T>(observer => {
    let timer = setTimeout(function () {
      observer.next(data);
      observer.complete();
    })
    observer.onUnsubscribe(function () {
      clearTimeout(timer);
    })
  })
}
