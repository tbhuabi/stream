import { Subscriber } from './subscriber';
import { Subscription } from './subscription';

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

export class Stream<T> {
  constructor(public source: (subscriber: Subscriber<T>) => Subscription | (() => void) | void = observer => {
    observer.complete();
  }) {
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
  pipe(...operators: Operator<any, any>[]): Stream<any>;
  pipe(...operators: Operator<any, any>[]): Stream<any> {
    if (operators.length === 0) {
      return this;
    }
    return operators.reduce((stream, nextOperator) => {
      return nextOperator(stream)
    }, this)
  }

  subscribe(observer?: PartialObserver<T>): Subscription;
  subscribe(observer?: ((value: T) => void), error?: (err: any) => void, complete?: () => void): Subscription;
  subscribe(
    observer: any = function () {
      //
    },
    error?: any,
    complete?: any): Subscription {

    const subscriber = this.toSubscriber(observer, error, complete);

    return this.trySubscribe(subscriber);
  }

  toPromise(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.subscribe(value => resolve(value), err => reject(err));
    })
  }

  protected toSubscriber(observer?: PartialObserver<T>): Subscriber<T>;
  protected toSubscriber(observer?: ((value: T) => void), error?: (err: any) => void, complete?: () => void): Subscriber<T>;
  protected toSubscriber(
    observer: any,
    error?: any,
    complete?: any) {
    if (typeof observer === 'function') {
      return new Subscriber<T>({
        next: observer,
        error,
        complete
      })
    }
    return new Subscriber<T>(observer);
  }

  protected trySubscribe(subscriber: Subscriber<T>) {
    const unsubscription = this.source(subscriber);
    if (typeof unsubscription === 'function') {
      return new Subscription(function () {
        subscriber.closed = true;
        unsubscription()
      });
    } else if (unsubscription instanceof Subscription) {
      return new Subscription(function () {
        subscriber.closed = true;
        unsubscription.unsubscribe();
      })
    }
    return new Subscription(function () {
      subscriber.closed = true;
    })
  }
}

