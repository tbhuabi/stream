import { Observable } from './observable';
import { Subscriber } from './subscriber';

export class Subject<T> extends Observable<T> {
  private subscribers: Subscriber<T>[] = [];

  constructor() {
    super(subscriber => {
      this.subscribers.push(subscriber);
      return () => {
        this.clean(subscriber);
      }
    })
  }

  asObservable(): Observable<T> {
    return new Observable<T>(subscriber => {
      this.subscribe(subscriber);
      return () => {
        this.clean(subscriber);
      }
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
    this.subscribers = []
  }

  complete() {
    [...this.subscribers].forEach(observer => {
      observer.complete();
    })
    this.subscribers = []
  }

  private clean(subscriber: Subscriber<T>) {
    const index = this.subscribers.indexOf(subscriber)
    if (index > -1) {
      this.subscribers.splice(index, 1)
    }
  }
}
