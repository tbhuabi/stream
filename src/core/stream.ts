export interface Observer<T> {
  next(value: T): void;

  error(err?: Error): void;

  complete(): void;

  onUnsubscribe?(callback: () => void);
}

export interface Operator<T, U> {
  (stream: Stream<T>): Stream<U>;
}

export interface NextObserver<T> {
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

export interface ErrorObserver<T> {
  next?: (value: T) => void;
  error: (err: any) => void;
  complete?: () => void;
}

export interface CompletionObserver<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete: () => void;
}

export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;

export interface Subscription {
  unsubscribe(): void
}

export class Stream<T> {
  private isStop = false;

  private stopFn: () => void;

  constructor(private source: (observer: Observer<T>) => void) {

  }

  pipe<U>(op: Operator<T, U>): Stream<U> {
    return op(this)
  }

  subscribe(observer: PartialObserver<T> | ((value: T) => void)): Subscription {
    const defaultHandlers = {
      error(err?: Error) {
        if (err) {
          throw err;
        }
      },
      complete() {

      }
    }
    let handlers = typeof observer === 'function' ? {
      next(value: T) {
        (observer as Function)(value)
      },
      ...defaultHandlers
    } : {
      ...defaultHandlers,
      ...observer,
    };
    const self = this;
    this.source({
      next(value: T) {
        if (self.isStop) {
          return;
        }
        handlers.next(value)
      },
      error(err: Error) {
        if (self.isStop) {
          return;
        }
        handlers.error(err)
      },
      complete() {
        if (self.isStop) {
          return;
        }
        handlers.complete()
      },
      onUnsubscribe(callback: () => void) {
        if (self.isStop) {
          return;
        }
        self.stopFn = callback;
      }
    })

    return {
      unsubscribe() {
        self.isStop = true
        if (typeof self.stopFn === 'function') {
          self.stopFn();
        }
      }
    }
  }
}

