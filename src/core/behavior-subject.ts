import { PartialObserver, Subscription } from './help';
import { trySubscribe } from './_utils';
import { Subject } from './subject';

export class BehaviorSubject<T> extends Subject<T> {
  constructor(private defaultValue: T) {
    super()
  }

  next(newValue: T) {
    this.defaultValue = newValue;
    super.next(newValue);
  }

  subscribe(observer: PartialObserver<T>): Subscription;
  subscribe(observer: ((value: T) => void), error?: (err: any) => void, complete?: () => void): Subscription;
  subscribe(observer: any, error?: any, complete?: any): Subscription {
    const n = trySubscribe(this.source, observer, error, complete)
    n.handle.next(this.defaultValue);
    return {
      unsubscribe() {
        n.closeFn();
      }
    }
  }
}
