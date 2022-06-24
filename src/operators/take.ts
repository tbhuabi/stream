import { Operator, PartialObserver, Observable, Subscription } from '../core/_api';

/**
 * 指定源数据流最多发送几次
 * @param count
 */
export function take<T>(count: number): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      let i = 0;
      const subscription = new Subscription()
      let isComplete = false
      const obs: PartialObserver<T> = {
        next(value) {
          if (i < count) {
            subscriber.next(value);
            i++;
            if (i === count) {
              isComplete = true
              subscription.unsubscribe()
              subscriber.complete();
            }
            return;
          }
          isComplete = true
          subscriber.complete();
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      }
      subscription.add(source.subscribe(obs));
      if (isComplete) {
        subscription.unsubscribe()
      }
      return subscription
    })
  }
}
