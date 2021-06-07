import { Stream } from '@tanbo/stream';

describe('Stream 同步订阅', () => {
  test('实时拿到结果', () => {
    const value = 5
    const stream = new Stream<number>(observer => {
      observer.next(value)
    })

    stream.subscribe(v => {
      expect(v).toBe(value)
    })
  })
  test('实时拿到结果', () => {
    const values = [1, 3, 6]
    const stream = new Stream<number>(observer => {
      values.forEach(i => observer.next(i))
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
    const stream = new Stream<number>(observer => {
      i++
      observer.next(5)
    })

    stream.subscribe()
    stream.subscribe()

    expect(i).toBe(2)
  })
})

describe('Stream 异步订阅',  () => {
  test('正确获取到到结果', async () => {
    const value = 5
    const stream = new Stream<number>(observer => {
      setTimeout(() => {
        observer.next(value)
      })
    })

    return new Promise<void>(resolve => {
      stream.subscribe(v => {
        expect(v).toBe(value)
        resolve()
      })
    })
  })
})
