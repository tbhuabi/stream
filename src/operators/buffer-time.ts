import { Observable, Operator } from '../core/_api';

/**
 * 当有新值时，延迟指定的时间，并收集这段时间中所有的值，在时间到达之后，把所有收集到的值一并发送
 * @param time 要延迟的时间
 */
export function bufferTime<T>(time: number): Operator<T, T[]> {
  return function (source: Observable<T>) {
    return new Observable<T[]>(subscriber => {
      let values: T[] = []
      let isStart = false
      let timer: any = null
      let isComplete = false
      const subscription = source.subscribe({
        next(value: T) {
          values.push(value)
          if (!isStart) {
            isStart = true
            timer = setTimeout(() => {
              const v = values
              values = []
              isStart = false
              subscriber.next(v)
              if (isComplete) {
                subscriber.complete()
              }
            }, time)
          }
        },
        error(err) {
          clearTimeout(timer)
          subscriber.error(err)
        },
        complete() {
          isComplete = true
          if (values.length) {
            return
          }
          subscriber.complete()
        }
      })
      return function () {
        clearTimeout(timer)
        subscription.unsubscribe()
      }
    })
  }
}
