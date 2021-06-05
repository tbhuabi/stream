import { Stream, Operator } from '../core/_api'

/**
 * 将源数据流延迟一段时间再发送
 * @param time
 */
export function delay<T>(time = 0): Operator<T, T> {
  return function (prevSteam: Stream<T>) {
    return new Stream<T>(observer => {
      let timer: any;
      let isComplete = false;
      let isUnsubscribe = false;
      const sub = prevSteam.subscribe({
        next(v: T) {
          timer = setTimeout(function () {
            observer.next(v);
            if (isComplete && !isUnsubscribe) {
              observer.complete();
            }
          }, time);
        },
        error(err?: Error) {
          observer.error(err);
        },
        complete() {
          isComplete = true
        }
      })
      observer.onUnsubscribe(function () {
        isUnsubscribe = true;
        clearTimeout(timer);
        sub.unsubscribe()
      })
    })
  }
}
