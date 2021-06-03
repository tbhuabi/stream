import { Subject } from '@tanbo/stream';

describe('Subject', () => {
  test('同步订阅', () => {
    const subject = new Subject()
    const n = 6
    subject.subscribe(value => {
      expect(value).toBe(n)
    })
    subject.next(n);
  })
})
