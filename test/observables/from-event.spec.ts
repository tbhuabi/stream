import { fromEvent } from '@tanbo/stream';

describe('fromEvent', () => {
  beforeEach(() => {
    const button = document.createElement('button')
    button.id = 'button';
    document.body.append(button)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('订阅点击事件', done => {
    const button = document.getElementById('button')!
    let ev: any
    fromEvent(button, 'click').subscribe(event => {
      ev = event
    })
    setTimeout(() => {
      button.click()
      expect(!!ev).toBeTruthy()
      done()
    })
  })
  test('取消订阅事件', done => {
    const button = document.getElementById('button')!
    const arr: any[] = []

    const unsub = fromEvent(button, 'click').subscribe(event => {
      arr.push(event)
      unsub.unsubscribe();
    })
    setTimeout(() => {
      button.click()
      button.click()
      expect(arr.length).toBe(1)
      done()
    })
  })
  test('多个订阅事件获取相同的事件对象', done => {
    const button = document.getElementById('button')!
    const arr: any[] = []
    const arr2: any[] = []
    document.body.append(button)

    const stream = fromEvent(button, 'click')
    stream.subscribe(event => {
      arr.push(event)
    })
    stream.subscribe(event => {
      arr2.push(event);
    })
    button.click()
    button.click()
    setTimeout(() => {
      expect(arr).toEqual(arr2)
      done()
    })
  })
  test('多个订阅事件互不干扰', done => {
    const button = document.getElementById('button')!
    const arr: any[] = []
    const arr2: any[] = []

    const stream = fromEvent(button, 'click')
    const unsub = stream.subscribe(event => {
      arr.push(event)
      unsub.unsubscribe()
    })
    stream.subscribe(event => {
      arr2.push(event);
    })
    setTimeout(() => {
      button.click()
      button.click()
      expect(arr.length).toEqual(1)
      expect(arr2.length).toEqual(2)
      done()
    })
  })
})
