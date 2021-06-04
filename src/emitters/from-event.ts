import { Observer, Stream } from '../core/_api';

export function fromEvent<T extends Event>(element: Element, type: string) {
  const observers: Observer<T>[] = [];

  function listenFn(event) {
    return observers.forEach(observer => {
      observer.next(event);
    })
  }

  return new Stream<T>(observer => {
    if (observers.length === 0) {
      element.addEventListener(type, listenFn);
    }
    observers.push(observer);
    observer.onUnsubscribe(() => {
      const index = observers.indexOf(observer);
      if (index > -1) {
        observers.splice(index, 1);
      }
      if (observers.length === 0) {
        element.removeEventListener(type, listenFn);
      }
    })
  })
}
