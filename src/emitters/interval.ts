import { Stream } from '../core/stream';

export function interval(delay = 1000, startCount = 0) {
  return new Stream<number>(observer => {
    let timer: any;
    let i = startCount;

    function next() {
      timer = setTimeout(function () {
        next();
        observer.next(i)
        i++;
      }, delay);
    }

    observer.onUnsubscribe(function () {
      clearTimeout(timer);
    })
    next()
  })
}
