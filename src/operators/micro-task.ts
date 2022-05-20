import { Observable, Operator } from '../core/_api'

/**
 * 创建一个微任务，并收集周期内所有的值，当微任务执行时，把所有缓存的值全部向后发送。
 */
export function microTask<T>(): Operator<T, T[]> {
  return function (source: Observable<T>) {
    return new Observable<T[]>(subscriber => {
      let values: T[] = []
      let task: Promise<void> | null = null
      let isComplete = false
      return source.subscribe({
        next(v: T) {
          values.push(v)
          if (!task) {
            task = Promise.resolve().then(() => {
              const nextValues = values
              values = []
              task = null
              subscriber.next(nextValues)
              if (isComplete) {
                subscriber.complete()
              }
            })
          }
        },
        error(err?: Error) {
          subscriber.error(err);
        },
        complete() {
          isComplete = true
        }
      })
    })
  }
}
