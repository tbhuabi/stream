import { Stream } from '@tanbo/stream';

export interface Observer<T> {
  next(value: T): void;

  error(err?: Error): void;

  complete(): void;

  onUnsubscribe?(callback: () => void);
}

export interface Operator<T, U> {
  (stream: Stream<T>): Stream<U>;
}

export interface Subscription {
  unsubscribe(): void
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

export type Publisher<T> = (observer: Observer<T>) => void;
