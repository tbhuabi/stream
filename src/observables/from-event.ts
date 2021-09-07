import { Observable, Subscriber } from '../core/_api';

/**
 * 绑定 DOM 事件，并转换为数据流
 * @param element 要绑定事件的 DOM 元素
 * @param type 事件名
 */
export function fromEvent<T extends Event>(element: Element, type: string) {
  const subscribers: Subscriber<T>[] = [];

  function listenFn(event) {
    return [...subscribers].forEach(subscriber => {
      subscriber.next(event);
    })
  }

  return new Observable<T>(subscriber => {
    if (subscribers.length === 0) {
      element.addEventListener(type, listenFn);
    }
    subscribers.push(subscriber);
    return function () {
      const index = subscribers.indexOf(subscriber);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0) {
        element.removeEventListener(type, listenFn);
      }
    }
  })
}
