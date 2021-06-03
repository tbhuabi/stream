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

  constructor(protected source?: (observer: Observer<T>) => void) {
  }

  pipe(): Stream<T>;
  pipe<V1>(op1: Operator<T, V1>): Stream<V1>;
  pipe<V1, V2>(op1: Operator<T, V1>, op2: Operator<V1, V2>): Stream<V2>;
  pipe<V1, V2, V3>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>): Stream<V3>;
  pipe<V1, V2, V3, V4>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>): Stream<V4>;
  pipe<V1, V2, V3, V4, V5>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>): Stream<V5>;
  pipe<V1, V2, V3, V4, V5, V6>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>, op6: Operator<V5, V6>): Stream<V6>;
  pipe<V1, V2, V3, V4, V5, V6, V7>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>, op6: Operator<V5, V6>, op7: Operator<V6, V7>): Stream<V7>;
  pipe<V1, V2, V3, V4, V5, V6, V7, V8>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>, op6: Operator<V5, V6>, op7: Operator<V6, V7>, op8: Operator<V7, V8>): Stream<V8>;
  pipe<V1, V2, V3, V4, V5, V6, V7, V8, V9>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>, op6: Operator<V5, V6>, op7: Operator<V6, V7>, op8: Operator<V7, V8>, op9: Operator<V8, V9>): Stream<V9>;
  pipe(...operators: Operator<any, any>[]): Stream<any> {
    if (operators.length === 0) {
      return this;
    }
    return operators.reduce((stream, nextOperator) => {
      return nextOperator(stream)
    }, this)
  }

  subscribe(observer: PartialObserver<T>): Subscription;
  subscribe(observer: ((value: T) => void), error?: (err: any) => void, complete?: () => void): Subscription;
  subscribe(observer: any, error?: any, complete?: any): Subscription {
    const handlers = this.normalizeSubscribe(observer, error, complete);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    if (this.source) {
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
    } else {
      handlers.next(void 0)
    }
    return {
      unsubscribe() {
        self.isStop = true
        if (typeof self.stopFn === 'function') {
          self.stopFn();
        }
      }
    }
  }

  protected normalizeSubscribe(observer: any, error?: any, complete?: any): Required<NextObserver<T>> {
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
    return typeof observer === 'function' ? {
      next(value: T) {
        (observer)(value)
      },
      ...defaultHandlers
    } : {
      ...defaultHandlers,
      ...observer,
    };
  }
}

