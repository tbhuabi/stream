import { microTask, of } from '@tanbo/stream';

describe('microTask', () => {
  test('延迟发送', done => {
    let hasValue = false
    of(1).pipe(microTask()).subscribe(() => {
      expect(hasValue).toBeTruthy()
      done()
    })
    hasValue = true
  })
  test('组装值', done => {
    of(1, 2, 3).pipe(microTask()).subscribe(v => {
      expect(v).toEqual([1, 2, 3])
      done()
    })
  })
  test('先于定时器执行', done => {
    let isChange = false
    setTimeout(() => {
      isChange = true
      done()
    })
    of(1).pipe(microTask()).subscribe(() => {
      expect(isChange).toBeFalsy()
    })
  })
  test('取消订阅不再接收值', done => {
    let hasValue = false
    const sub = of(1).pipe(microTask()).subscribe(() => {
      hasValue = true
    })
    sub.unsubscribe()
    setTimeout(() => {
      expect(hasValue).toBeFalsy()
      done()
    })
  })
  test('多个订阅互不影响', done => {
    let hasValue1 = false
    let hasValue2 = false
    const obs = of(1).pipe(microTask())

    const sub1 = obs.subscribe(() => {
      hasValue1 = true
    })
    obs.subscribe(() => {
      hasValue2 = true
    })
    sub1.unsubscribe()
    setTimeout(() => {
      expect(hasValue1).toBeFalsy()
      expect(hasValue2).toBeTruthy()
      done()
    })
  })
})
