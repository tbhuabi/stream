import { PartialObserver } from './stream';

export class Subscriber<T> {
  closed = false
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
    this.destinationOrNext.next(value);
  }

  error(err: any) {
    if (this.closed) {
      return;
    }
    this.closed = true;
    if (this.destinationOrNext.error) {
      this.destinationOrNext.error(err);
      return;
    }
    throw err;
  }

  complete() {
    if (this.closed) {
      return;
    }
    this.closed = true
    if (this.destinationOrNext.complete) {
      this.destinationOrNext.complete();
    }
  }
}
