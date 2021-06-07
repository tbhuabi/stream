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
  let isComplete = false
  const handle: Observer<T> = {
    next(value: T) {
      if (isComplete) {
        return;
      }
      try {
        handlers.next(value)
      } catch (e) {
        handlers.error(e)
      }
    },
    error(err: Error) {
      if (isComplete) {
        return;
      }
      handlers.error(err)
    },
    complete() {
      if (isComplete) {
        return;
      }
      isComplete = true;
      handlers.complete()
    },
    onUnsubscribe(callback: () => void) {
      closeFn = function () {
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
