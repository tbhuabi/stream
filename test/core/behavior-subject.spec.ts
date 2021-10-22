import { BehaviorSubject } from '@tanbo/stream';

describe('BehaviorSubject 同步订阅', () => {
  test('没有新数据时，正常合到默认值', () => {
    const subject = new BehaviorSubject(5);
    subject.subscribe(value => {
      expect(value).toBe(5)
    })
  })
  test('数据更新后，拿到最新值', () => {
    const subject = new BehaviorSubject(5);
    subject.next(6)
    subject.subscribe(value => {
      expect(value).toBe(6)
    })
  })
  test('可以获取到后发布的值', () => {
    const subject = new BehaviorSubject(5);
    let value!: number
    subject.subscribe(v => {
      value = v
    })
    subject.next(6)
    expect(value).toBe(6)
  })
  test('取消订阅后，不再得到通知', () => {
    const subject = new BehaviorSubject(5);
    subject.next(6)
    let v!: number
    subject.subscribe(value => {
      v = value
    }).unsubscribe()
    subject.next(7)
    expect(v).toBe(6)
  })
})
