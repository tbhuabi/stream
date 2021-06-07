import { Subject } from '@tanbo/stream';

describe('Subject 同步订阅', () => {
  test('实时拿到结果', () => {
    const subject = new Subject()
    const n = 6
    subject.subscribe(value => {
      expect(value).toBe(n)
    })
    subject.next(n);
  })
  test('不能获取订阅前发送的数据', () => {
    const subject = new Subject()
    subject.next(1)
    subject.subscribe(value => {
      expect(value).toBe(2)
    })
    subject.next(2);
  })
})
