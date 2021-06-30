import { PartialObserver } from './observable';
import { Subject } from './subject';
import { Subscription } from './subscription'

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
  subscribe(observer?: (value: T) => void): Subscription;
  subscribe(
    observer: any = function () {
      //
    }): Subscription {
    const subscriber = this.toSubscriber(observer);
    const subscription = this.trySubscribe(subscriber);
    subscriber.next(this.currentValue);
    return subscription;
  }
}
