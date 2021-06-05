import { Stream } from '../core/_api';

/**
 * 监听一组数据流，当所有数据到达时，将数据按输入顺序，以一个数组的形式发送，
 * 同时重置状态，当下一次所有数据到达时，再次发送
 * @param inputs
 */
export function zip(...inputs: Stream<any>[]): Stream<any[]> {
  return new Stream<any[]>(observer => {
    if (inputs.length === 0) {
      observer.complete();
      return;
    }
    const marks = inputs.map(i => {
      return {
        source: i,
        hasMessage: false,
        value: null
      }
    });

    const subs = marks.map(i => {
      return i.source.subscribe(value => {
        i.value = value;
        i.hasMessage = true;
        if (marks.every(o => o.hasMessage)) {
          marks.forEach(k => k.hasMessage = false);
          observer.next(marks.map(j => j.value));
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
