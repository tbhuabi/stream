import { NextObserver, Observer, PartialObserver, Publisher } from '../help';

function normalizeSubscribe<T>(observer: any, error?: any, complete?: any): Required<NextObserver<T>> {
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
      observer(value)
    },
    ...defaultHandlers
  } : {
    ...defaultHandlers,
    ...observer,
  };
}

export function trySubscribe<T>(
  source: Publisher<T>,
  observer: PartialObserver<T> | ((value: T) => void),
  error?: (err: any) => void,
  complete?: () => void) {
  const handlers = normalizeSubscribe(observer, error, complete);
  let isUnsubscribe = false;
  let isComplete = false;
  let hasError = false

  let closeFn = function () {
    isUnsubscribe = true;
  }
  const handle: Observer<T> = {
    next(value: T) {
      if (isComplete || isUnsubscribe || hasError) {
        return;
      }
      try {
        handlers.next(value)
      } catch (e) {
        hasError = true
        throw e
      }
    },
    error(err: Error) {
      if (isComplete || isUnsubscribe || hasError) {
        return;
      }
      hasError = true;
      handlers.error(err);
    },
    complete() {
      if (isComplete || isUnsubscribe || hasError) {
        return;
      }
      isComplete = true;
      handlers.complete()
    },
    onUnsubscribe(callback: () => void) {
      closeFn = function () {
        isUnsubscribe = true;
        callback();
      };
    }
  }
  source(handle)
  return {
    closeFn,
    handle
  };
}
