import { Observable } from '../core/_api';

/**
 * 绑定 DOM 事件，并转换为数据流
 * @param source 要绑定事件的 DOM 元素
 * @param type 事件名
 * @param capture 是否使用事件捕获
 */
export function fromEvent<T extends Event>(source: Element | Window | Document, type: string, capture = false) {
  return new Observable<T>(subscriber => {
    function listenFn(event) {
      return subscriber.next(event)
    }

    source.addEventListener(type, listenFn, capture);
    return function () {
      source.removeEventListener(type, listenFn, capture)
    }
  })
}
