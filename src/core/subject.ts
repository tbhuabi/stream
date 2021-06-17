import { Stream } from './stream';
import { Subscriber } from './subscriber';

export class Subject<T> extends Stream<T> {
  private subscribers: Subscriber<T>[] = [];

  constructor() {
    super(subscriber => {
      this.subscribers.push(subscriber);
    })
  }

  next(newValue: T) {
    [...this.subscribers].forEach(observer => {
      try {
        observer.next(newValue);
      } catch (e) {
        observer.error(e);
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
