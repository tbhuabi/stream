import { Observable } from '../core/_api';

/**
 * 创建间隔固定时间，发送新值的数据流
 * @param period 间隔的时间
 */
export function interval(period = 1000) {
  return new Observable<number>(subscriber => {
    let timer: any;
    let i = 0;

    function next() {
      timer = setTimeout(function () {
        subscriber.next(i);
        next();
        i++;
      }, period);
    }

    next()
    return function () {
      clearTimeout(timer);
    }
  })
}
