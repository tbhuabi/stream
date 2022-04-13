import { Observable, Subscriber } from '../core/_api';

/**
 * 绑定 DOM 事件，并转换为数据流
 * @param source 要绑定事件的 DOM 元素
 * @param type 事件名
 */
export function fromEvent<T extends Event>(source: Element | Window | Document, type: string) {
  let cachedSubscriber: Subscriber<T>

  function listenFn(event) {
    return cachedSubscriber.next(event)
  }

  return new Observable<T>(subscriber => {
    cachedSubscriber = subscriber
    source.addEventListener(type, listenFn);
    return function () {
      source.removeEventListener(type, listenFn)
    }
  })
}
