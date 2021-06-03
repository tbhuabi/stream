import { Observer, PartialObserver, Stream, Subscription } from './stream';

export class BehaviorStream<T> extends Stream<T> {
  private observer: Observer<T>

  constructor(private defaultValue: T) {
    super(observer => {
      this.observer = observer
      observer.next(this.defaultValue)
    });
  }

  next(newValue: T) {
    if (this.observer) {
      this.observer.next(newValue)
    }
  }
}
