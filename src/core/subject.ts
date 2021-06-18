import { Observable } from './observable';
import { Subscriber } from './subscriber';

export class Subject<T> extends Observable<T> {
  private subscribers: Subscriber<T>[] = [];

  constructor() {
    super(subscriber => {
      this.subscribers.push(subscriber);
    })
  }

  next(newValue: T) {
    [...this.subscribers].forEach(subscriber => {
      try {
        subscriber.next(newValue);
      } catch (e) {
        if (subscriber.syncErrorThrowable) {
          subscriber.error(e);
        } else {
          throw e;
        }
      }
    })
  }

  error(err: Error) {
    [...this.subscribers].forEach(observer => {
      observer.error(err);
    })
  }

  complete() {
    [...this.subscribers].forEach(observer => {
      observer.complete();
    })
  }
}
