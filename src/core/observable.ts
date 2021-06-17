import { Subscriber } from './subscriber';
import { Subscription } from './subscription';

export interface Operator<T, U> {
  (source: Observable<T>): Observable<U>;
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

export class Observable<T> {
  constructor(public source: (subscriber: Subscriber<T>) => Subscription | (() => void) | void = observer => {
    observer.complete();
  }) {
  }

  pipe(): Observable<T>;
  pipe<V1>(op1: Operator<T, V1>): Observable<V1>;
  pipe<V1, V2>(op1: Operator<T, V1>, op2: Operator<V1, V2>): Observable<V2>;
  pipe<V1, V2, V3>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>): Observable<V3>;
  pipe<V1, V2, V3, V4>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>): Observable<V4>;
  pipe<V1, V2, V3, V4, V5>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>): Observable<V5>;
  pipe<V1, V2, V3, V4, V5, V6>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>, op6: Operator<V5, V6>): Observable<V6>;
  pipe<V1, V2, V3, V4, V5, V6, V7>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>, op6: Operator<V5, V6>, op7: Operator<V6, V7>): Observable<V7>;
  pipe<V1, V2, V3, V4, V5, V6, V7, V8>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>, op6: Operator<V5, V6>, op7: Operator<V6, V7>, op8: Operator<V7, V8>): Observable<V8>;
  pipe<V1, V2, V3, V4, V5, V6, V7, V8, V9>(op1: Operator<T, V1>, op2: Operator<V1, V2>, op3: Operator<V2, V3>, op4: Operator<V3, V4>, op5: Operator<V4, V5>, op6: Operator<V5, V6>, op7: Operator<V6, V7>, op8: Operator<V7, V8>, op9: Operator<V8, V9>): Observable<V9>;
  pipe(...operators: Operator<any, any>[]): Observable<any>;
  pipe(...operators: Operator<any, any>[]): Observable<any> {
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
    let s: Subscription | (() => void) | void;
    try {
      s = this.source(subscriber)
    } catch (e) {
      if (subscriber.syncErrorThrowable) {
        subscriber.error(e);
      } else {
        throw e;
      }
    }
    if (typeof s === 'function') {
      return new Subscription(function () {
        subscriber.closed = true;
        (s as () => void)()
      });
    } else if (s instanceof Subscription) {
      return new Subscription(function () {
        subscriber.closed = true;
        (s as Subscription).unsubscribe();
      })
    }
    return new Subscription(function () {
      subscriber.closed = true;
    })
  }
}

