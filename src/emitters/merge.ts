import { Stream } from '../core/_api';

/**
 * 监听多个数据流，当任意一个有新值时，均向后发送
 * @param inputs 数据源
 */
export function merge<T>(...inputs: Stream<T>[]): Stream<T> {
  return new Stream<T>(observer => {
    if (inputs.length === 0) {
      observer.complete();
    }
    const marks = inputs.map(i => {
      return {
        source: i,
        isComplete: false
      }
    })
    const subs = marks.map(s => {
      return s.source.subscribe(value => {
        observer.next(value);
      }, err => {
        observer.error(err);
      }, () => {
        s.isComplete = true;
        if (marks.every(i => i.isComplete)) {
          observer.complete();
        }
      })
    })
    observer.onUnsubscribe(() => {
      subs.forEach(i => i.unsubscribe());
    })
  })
}
