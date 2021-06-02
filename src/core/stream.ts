export interface Publisher<T> {
  next(value: T): void;

  error(err?: Error): void;

  complete(): void;

  onUnListen?(callback: () => void);
}

export interface Operator<T, U> {
  (prevStream: Stream<T>): Stream<U>;
}

export type Listener<T> = Partial<Publisher<T>> | ((value: T) => void);

export interface UnListen {
  unListen(): void
}

export class Stream<T> {
  private isStop = false;

  private stopFn: () => void;

  constructor(private source: (publisher: Publisher<T>) => void) {

  }

  pipe<U>(op: Operator<T, U>): Stream<U> {
    return op(this)
  }

  listen(listener: Listener<T>): UnListen {
    const defaultHandlers = {
      error(err?: Error) {
        if (err) {
          throw err;
        }
      },
      complete() {

      }
    }
    let handlers = typeof listener === 'function' ? {
      next(value: T) {
        (listener as Function)(value)
      },
      ...defaultHandlers
    } : {
      ...defaultHandlers,
      ...listener,
    };
    const self = this;
    this.source({
      next(value: T) {
        if (self.isStop) {
          return;
        }
        console.log(value)
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
      onUnListen(callback: () => void) {
        if (self.isStop) {
          return;
        }
        self.stopFn = callback;
      }
    })

    return {
      unListen() {
        self.isStop = true
        if (typeof self.stopFn === 'function') {
          self.stopFn();
        }
      }
    }
  }
}

