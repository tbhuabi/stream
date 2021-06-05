import { Stream } from '../core/_api';

/**
 * 监听一组数据流，并发出最先到达的数据，然后忽略后面的值，当所有数据
 * 流都有新数据时，重置状态并重新发送最先到达的数据
 * @param inputs
 */
export function race<T>(...inputs: Stream<T>[]): Stream<T> {
  return new Stream<T>(observer => {
    if (inputs.length === 0) {
      observer.complete();
      return;
    }
    let canPublish = true
    const marks = inputs.map(i => {
      return {
        source: i,
        hasMessage: false,
      }
    });

    const subs = marks.map(i => {
      return i.source.subscribe(value => {
        i.hasMessage = true;
        if (canPublish) {
          observer.next(value);
          canPublish = false;
        }
        if (marks.every(o => !o.hasMessage)) {
          marks.forEach(j => j.hasMessage = false);
          canPublish = true;
        }
      }, function (err) {
        observer.error(err);
      }, function () {
        subs.forEach(i => i.unsubscribe());
        observer.complete();
      })
    })
  })
}
