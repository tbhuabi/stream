import { fromPromise } from '@tanbo/stream';

describe('fromPromise', () => {
  test('获取正常结果', done => {
    const value = 1
    fromPromise<number>(new Promise<number>(resolve => {
      resolve(value)
    })).subscribe(v => {
      expect(v).toBe(value)
      done()
    })
  })

  test('捕获错误', done => {
    const err = new Error()
    fromPromise<number>(new Promise<number>((resolve, reject) => {
      reject(err)
    })).subscribe({
      error(e) {
        expect(e).toBe(err)
        done()
      }
    })
  })

  test('正常结果触发完成', done => {
    let i = false
    fromPromise<boolean>(new Promise<boolean>(resolve => {
      resolve(true)
    })).subscribe({
      next(v) {
        i = v;
      },
      complete() {
        expect(i).toBeTruthy()
        done()
      }
    })
  })
})
