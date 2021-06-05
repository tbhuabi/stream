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
  let closeFn = function () {
  }
  let isUnsubscribe = false;
  const handle: Observer<T> = {
    next(value: T) {
      if (isUnsubscribe) {
        return;
      }
      try {
        handlers.next(value)
      } catch (e) {
        handlers.error(e)
      }
    },
    error(err: Error) {
      if (isUnsubscribe) {
        return;
      }
      handlers.error(err)
    },
    complete() {
      if (isUnsubscribe) {
        return;
      }
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
