import { PartialObserver, Subscription } from './help';
import { Subject } from './subject';

export class BehaviorSubject<T> extends Subject<T> {
  private currentValue: T;

  constructor(defaultValue: T) {
    super()
    this.currentValue = defaultValue;
  }

  next(newValue: T) {
    this.currentValue = newValue;
    super.next(newValue);
  }

  subscribe(observer?: PartialObserver<T>): Subscription;
  subscribe(observer?: ((value: T) => void), error?: (err: any) => void, complete?: () => void): Subscription;
  subscribe(
    observer: any = function () {
    },
    error?: any,
    complete?: any): Subscription {
    const subscriber = this.toSubscriber(observer, error, complete);
    const subscription = this.trySubscribe(subscriber);
    subscriber.next(this.currentValue);
    return subscription;
  }
}
