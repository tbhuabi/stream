import { PartialObserver } from './observable';

export class Subscriber<T> {
  closed = false
  syncErrorThrowable = true
  private destinationOrNext: Partial<PartialObserver<T>>;

  constructor(destinationOrNext: PartialObserver<any> | ((value: T) => void)) {
    if (typeof destinationOrNext === 'function') {
      this.destinationOrNext = {
        next: destinationOrNext
      }
    } else {
      this.destinationOrNext = destinationOrNext;
    }
  }

  next(value: T) {
    if (this.closed) {
      return;
    }
    if (this.destinationOrNext.next) {
      this.syncErrorThrowable = false;
      this.destinationOrNext.next(value);
      this.syncErrorThrowable = true;
    }
  }

  error(err: any) {
    if (this.closed) {
      return;
    }
    this.closed = true;
    if (this.destinationOrNext.error) {
      this.syncErrorThrowable = false;
      this.destinationOrNext.error(err);
      this.syncErrorThrowable = true;
      return;
    }
    this.syncErrorThrowable = false;
    throw err;
  }

  complete() {
    if (this.closed) {
      return;
    }
    this.closed = true
    if (this.destinationOrNext.complete) {
      this.syncErrorThrowable = false;
      this.destinationOrNext.complete();
      this.syncErrorThrowable = true;
    }
  }
}
