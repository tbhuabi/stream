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

  subscribe(observer: PartialObserver<T>): Subscription;
  subscribe(observer: ((value: T) => void), error?: (err: any) => void, complete?: () => void): Subscription;
  subscribe(observer: any, error?: any, complete?: any): Subscription {
    const defaultHandlers = {
      error: error || function (err?: Error) {
        if (err) {
          throw err;
        }
      },
      complete: complete || function () {
        //
      }
    }
    const handlers = typeof observer === 'function' ? {
      next(value: T) {
        (observer)(value)
      },
      ...defaultHandlers
    } : {
      ...defaultHandlers,
      ...observer,
    };
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.source({
      next(value: T) {
        if (self.isStop) {
          return;
        }
        try {
          handlers.next(value)
        } catch (e) {
          handlers.error(e)
        }
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

