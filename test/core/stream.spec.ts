import { Stream } from '@tanbo/stream';

describe('Stream 同步订阅', () => {
  test('实时拿到结果', () => {
    const value = 5
    const stream = new Stream<number>(subscriber => {
      subscriber.next(value)
    })

    stream.subscribe(v => {
      expect(v).toBe(value)
    })
  })
  test('实时拿到结果', () => {
    const values = [1, 3, 6]
    const stream = new Stream<number>(subscriber => {
      values.forEach(i => subscriber.next(i))
    })

    const result: number[] = [];
    let i = 0
    stream.subscribe(v => {
      i++
      result.push(v)
    })

    expect(result).toEqual(values)
    expect(i).toBe(values.length)
  })

  test('每次订阅，创建新的数据流', () => {
    let i = 0
    const stream = new Stream<number>(subscriber => {
      i++
      subscriber.next(5)
    })

    stream.subscribe()
    stream.subscribe()

    expect(i).toBe(2)
  })
  test('兼容两种订阅方式', () => {
    const data = {}
    const stream = new Stream<any>(subscriber => {
      subscriber.next(data);
    })

    let d1 = null;
    let d2 = null;
    stream.subscribe(value => d1 = value);
    stream.subscribe({
      next(value) {
        d2 = value
      }
    });

    expect(d1).toBe(d2)
  })
  test('捕获异常主动异常', () => {
    const err = new Error()
    const stream = new Stream(subscriber => {
      subscriber.error(err)
    })
    let b = false
    stream.subscribe({
      error(e) {
        b = e === err
      }
    })
    expect(b).toBeTruthy()
  })

  test('捕获异常被动异常', () => {
    const err = new Error()
    const stream = new Stream(() => {
      throw err;
    })
    let b = false
    stream.subscribe({
      error(e) {
        b = e === err
      }
    })
    expect(b).toBeTruthy()
  })

  test('不捕获订阅回调内异常', () => {
    const err = new Error()
    const stream = new Stream(subscriber => {
      subscriber.next(333)
    })
    let isCatch = false
    expect(() => {
      stream.subscribe({
        next() {
          throw err
        },
        error() {
          isCatch = true;
        }
      })
    }).toThrowError()
    expect(isCatch).toBeFalsy();
  })

  test('主动抛出异常', () => {
    const err = new Error()
    const stream = new Stream(subscriber => {
      subscriber.error(err)
    })
    expect(() => stream.subscribe()).toThrowError()
  })
  test('被动抛出异常', () => {
    const err = new Error()
    const stream = new Stream(() => {
      throw err;
    })
    expect(() => stream.subscribe()).toThrowError(err)
  })
  test('正常结束', () => {
    const stream = new Stream(subscriber => {
      subscriber.complete()
    })
    let b = false
    stream.subscribe({
      complete() {
        b = true
      }
    })
    expect(b).toBeTruthy()
  })

  test('结束后，不能再发送数据', () => {
    const stream = new Stream(subscriber => {
      subscriber.complete()
      subscriber.next({})
    })
    let b = false
    stream.subscribe({
      next() {
        b = true;
      }
    })
    expect(b).toBeFalsy()
  })

  test('结束后，不能再发送异常', () => {
    const stream = new Stream(subscriber => {
      subscriber.complete()
      subscriber.error(new Error())
    })
    let b = false
    stream.subscribe({
      error() {
        b = true;
      }
    })
    expect(b).toBeFalsy()
  })

  test('不能多次结束', () => {
    let i = 0
    const stream = new Stream(subscriber => {
      subscriber.complete()
      subscriber.complete()
    })
    stream.subscribe({
      complete() {
        i++
      }
    })
    expect(i).toBe(1)
  })

  test('未定义数据源时立即结束', () => {
    let i = 0
    const stream = new Stream()
    stream.subscribe({
      complete() {
        i++
      }
    })
    expect(i).toBe(1)
  })
})

describe('Stream 异步订阅', () => {
  test('正确获取到到结果', async () => {
    const value = 5
    const stream = new Stream<number>(subscriber => {
      setTimeout(() => {
        subscriber.next(value)
      })
    })

    return new Promise<void>(resolve => {
      stream.subscribe(v => {
        expect(v).toBe(value)
        resolve()
      })
    })
  })

  test('取消订阅后不再接收数据', async () => {
    const stream = new Stream<number>(subscriber => {
      subscriber.next(1)
      setTimeout(() => {
        subscriber.next(2)
        subscriber.next(3)
      })
    })
    return new Promise<void>(resolve => {
      let i = null;
      const unsub = stream.subscribe({
        next(value) {
          i = value
          if (value === 2) {
            unsub.unsubscribe()
          }
        }
      })
      setTimeout(() => {
        expect(i).toBe(2)
        resolve()
      }, 10)
    })
  })

  test('转 Promise', async () => {
    const value = 5
    const stream = new Stream<number>(subscriber => {
      setTimeout(() => {
        subscriber.next(value)
      })
    })

    return stream.toPromise().then(v => {
      expect(v).toBe(value)
    })
  })

  test('转 Promise 捕获异常', async () => {
    const err = new Error()
    const stream = new Stream<number>(subscriber => {
      setTimeout(() => {
        subscriber.error(err)
      })
    })

    return stream.toPromise().catch(e => {
      expect(e).toBe(err)
    })
  })
})
