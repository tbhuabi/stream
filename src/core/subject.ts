import { Stream } from './stream';
import { Observer } from './help'

export class Subject<T> extends Stream<T> {
  private observers: Observer<T>[] = [];

  constructor() {
    super(observer => {
      this.observers.push(observer);
      observer.onUnsubscribe(() => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
          this.observers.splice(index, 1);
        }
      })
    })
  }

  next(newValue: T) {
    [...this.observers].forEach(observer => {
      try {
        observer.next(newValue);
      } catch (e) {
        observer.error(e);
      }
    })
  }

  error(err: Error) {
    [...this.observers].forEach(observer => {
      observer.error(err);
    })
  }

  complete() {
    [...this.observers].forEach(observer => {
      observer.complete();
    })
  }
}
