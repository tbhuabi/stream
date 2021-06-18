import { interval } from '@tanbo/stream';

describe('interval', () => {
  test('正常发送值', done => {
    const unsub = interval().subscribe(value => {
      unsub.unsubscribe();
      expect(value).toBe(0)
      done()
    })
  })
  test('取消订阅后不发送新值', done => {
    let i = 0;
    const unsub = interval(0).subscribe(value => {
      i = value;
      unsub.unsubscribe();
    })
    setTimeout(() => {
      expect(i).toBe(0)
      done()
    }, 10)
  })
  test('连续递增发送值', done => {
    const arr: number[] = []
    const unsub = interval(0).subscribe(value => {
      arr.push(value);
      if (value === 3) {
        unsub.unsubscribe();
        expect(arr).toEqual([0, 1, 2, 3])
        done()
      }
    })
  })
})
