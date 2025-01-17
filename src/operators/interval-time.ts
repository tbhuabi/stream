import { Observable, Operator } from '../core/_api'

/**
 * 让所有数据流按固定间隔时间向后推送
 * @param time 数据间隔时间
 */
export function intervalTime<T>(time: number): Operator<T, T> {
  return function (source: Observable<T>) {
    return new Observable<T>(subscriber => {
      const buffer: T[] = []
      let canPublish = true
      let isCompleted = false

      let timer: any = null
      const next = () => {
        if (buffer.length > 0) {
          subscriber.next(buffer.shift()!)
          timer = setTimeout(next, time)
        } else {
          canPublish = true
          if (isCompleted) {
            subscriber.complete()
          }
        }
      }

      const obs = source.subscribe({
        next(value) {
          if (!canPublish) {
            buffer.push(value)
            return
          }
          subscriber.next(value)
          canPublish = false
          timer = setTimeout(next, time)
        },
        error(error) {
          clearTimeout(timer)
          subscriber.error(error)
        },
        complete() {
          if (buffer.length) {
            isCompleted = true
            return
          }
          clearTimeout(timer)
          subscriber.complete()
        }
      })

      return () => {
        obs.unsubscribe()
      }
    })
  }
}
