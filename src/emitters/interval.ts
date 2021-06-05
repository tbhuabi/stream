import { Stream } from '../core/_api';

/**
 * 创建间隔固定时间，发送新值的数据流
 * @param delay 间隔的时间
 * @param startCount 从哪个数字开始发送
 */
export function interval(delay = 1000, startCount = 0) {
  return new Stream<number>(observer => {
    let timer: any;
    let i = startCount;

    function next() {
      timer = setTimeout(function () {
        next();
        observer.next(i);
        i++;
      }, delay);
    }

    observer.onUnsubscribe(function () {
      clearTimeout(timer);
    })
    next()
  })
}
