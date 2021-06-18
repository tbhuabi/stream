import { Observable } from '../core/_api';

/**
 * 创建间隔固定时间，发送新值的数据流
 * @param delay 间隔的时间
 */
export function interval(delay = 1000) {
  return new Observable<number>(subscriber => {
    let timer: any;
    let i = 0;

    function next() {
      timer = setTimeout(function () {
        next();
        subscriber.next(i);
        i++;
      }, delay);
    }

    next()
    return function () {
      clearTimeout(timer);
    }
  })
}
