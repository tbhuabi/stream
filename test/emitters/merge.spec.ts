import { fromPromise, merge, of, Stream } from '@tanbo/stream';

describe('merge', () => {
  test('发送每一个数据', done => {
    const arr = []
    merge(fromPromise(Promise.resolve().then(() => 0)), of(1, 2)).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([1, 2, 0])
        done()
      }
    })
  })
  test('没有入参立即触发结束且不发送数据和异常', done => {
    let flag = false
    merge().subscribe({
      next() {
        flag = true
      },
      error() {
        flag = true
      },
      complete() {
        expect(flag).toBeFalsy()
        done()
      }
    })
  })
  test('所有结束才触发结束', done => {
    const arr = []
    merge(of(0), of(1), new Stream(observer => {
      setTimeout(() => {
        observer.next(2)
        observer.complete()
      })
    })).subscribe({
      next(value) {
        arr.push(value)
      },
      complete() {
        expect(arr).toEqual([0, 1, 2])
        done()
      }
    })
  })
  test('只触发一次异常', done => {
    const arr = []
    merge(
      fromPromise(
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error())
          })
        })
      ),
      new Stream(observer => {
        setTimeout(() => {
          observer.error(new Error())
          observer.complete()
        })
      })
    ).subscribe({
      error(err) {
        arr.push(err)
      }
    })
    setTimeout(() => {
      expect(arr.length).toBe(1)
      done()
    }, 10)
  })
  test('取消订阅后不再接收数据', done => {
    const arr = []
    const unsub = merge(new Stream(observer => {
      setTimeout(() => {
        observer.next(1)
        observer.next(2)
      })
    })).subscribe(value => {
      arr.push(value)
      unsub.unsubscribe();
    })
    setTimeout(() => {
      expect(arr).toEqual([1])
      done()
    }, 10)
  })
})
