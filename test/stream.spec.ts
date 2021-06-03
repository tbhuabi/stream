import { Stream } from '@tanbo/stream';

describe('Stream', () => {
  test('同步订阅', () => {
    const value = 5
    const stream = new Stream<number>(observer => {
      observer.next(value)
    })

    stream.subscribe(v => {
      expect(v).toBe(value)
    })
  })
})
