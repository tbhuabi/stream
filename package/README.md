Stream 数据流处理库
======================

## 安装

```
npm install @tanbo/stream
```

## 核心类

### Observable

最基础的数据流类，每一次订阅产生一个新的数据流。

```ts
import { Observable } from '@tanbo/stream';

const stream = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
})

stream.subscribe(value => {
  console.log(value);
})
// 输出：
// 1
// 2
```

### Subject

基础广播类，所有订阅者共用同一个数据流，且只会拿到订阅后广播的数据。
```ts
import { Subject } from '@tanbo/stream';

const subject = new Subject();

subject.next(1);

subject.subscribe(value => {
  console.log(value);
})

subject.next(2);

// 输出：
// 2
```

### BehaviorSubject

有默认值的广播类，所有订阅者共用同一个数据流，且所有订阅者在订阅时会同步拿到数据流中的最后一次数据，如果还没有广播，则同步拿到默认数据。

```ts
import { BehaviorSubject } from '@tanbo/stream';

const behaviorSubject = new BehaviorSubject(1);

behaviorSubject.subscribe(value => {
  console.log(value);
})
// 输出：
// 1

behaviorSubject.next(2);
// 输出：
// 2
```

### 取消订阅

`Observable`、`Subject`、`BehaviorSubject` 类都可以通过同样的方法取消订阅。以 Observable 为例：

```ts
const stream = new Observable(subscriber => {
  setTimeout(() => {
    subscriber.next(1);
  }, 1000)
})

const subscription = stream.subscribe(value => {
  console.log(value);
})
// 取消订阅
subscription.unsubscribe();
// 前面的 console.log 不会执行，因为在还没有发送数据时，已取消了订阅
```

## 数据流发射器

所有的数据流发射器都返回一个 Observable 实例。

### fromEvent

把 DOM 事件转换成数据流。
```ts
fromEvent(document.getElementById('button'), 'click').subscribe(event => {
  console.log(event);
})
```

### fromPromise

把 Promise 转换成数据流。

```ts

const promise = new Promise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})

fromPromise(promise).subscribe(value => {
  // 在 1 秒后，会收到由 Promise 发来的值
  console.log(value)
})
```

### interval

按固定间隔时间发送值，默认间隔 1 秒，从 0 开始。

```ts
interval().subscribe(value => {
  console.log(value);
})
// 输出：
// 0
// 1
// 2
// 3
// ...
```

### merge

同时订阅多个数据流，当任意一个数据流有新值时，立即将该值发送出去。

```ts
merge(interval(), interval()).subscribe(value => {
  console.log(value);
})
// 输出：
// 1
// 1
// 2
// 2
// 3
// 3
// 4
// ...
```

### of

将既定的值按顺序同步发送。

```ts
of(1, 2, 3).subscribe(value => {
  console.log(value);
})

// 输出：
// 1
// 2
// 3
```

### race

同时订阅多个数据流，当任意一个数据流有新值时，立即将该值发送出去，同时忽略后面所有的值

```ts
race(interval(1000), of('a')).subscribe(value => {
  console.log(value)
})
// 输出：
// 'a'
```

### timeout

延迟一段时间发送值。默认延迟一秒。

```ts
timeout().subscribe(() => {
  console.log('1 秒后打印此消息');
})
```

### zip

监听一组数据流，当所有数据到达时，将最新数据按输入顺序，以一个数组的形式发送并忽略后面的所有数据。可以理解为 `Promise.all`。

```ts
zip(of(1), of(2), timeout(1000, 'timeout')).subscribe(value => {
  console.log(value);
})
// 输出：
// [1, 2, 'timeout']
```


## 操作符

操作符是对既有数据流作进一步有流程控制、数据转换或添加副作用。

操作符均通过 `pipe` 方法添加。`pipe` 方法既可以传入多个操作符，也可以链式调用。以下两种方式是等价的：

```ts
// 链式调用
interval()
  .pipe(take(4))
  .pipe(delay(2000))
  .subscribe(value => {
    console.log(value)
  })
// 多参数调用
interval().pipe(
  take(4),
  delay(2000)
).subscribe(value => {
  console.log(value)
})
```

### auditTime

当有新值时，记录值，并延迟一段时间，发送记录的值。

```ts
interval(1000).pipe(auditTime(2000)).subscribe(value => {
  console.log(value);
})
// 输出：
// 1
// 3
// 5
// 7
// ...
```

### concat

按顺序依次发出数据流本身和传入源的值，需要注意的事，只有前一个数据流完成时，才会监听并发送后一个数据流的值。

```ts
timeout(1000, 1).pipe(
  concat(
    of('a', 'b'),
    of('A', 'B')
  )
).subscribe(value => {
  console.log(value);
})
// 输出：
// 1
// 'a'
// 'b'
// 'A'
// 'B'
```

### debounceTime

在一段时间内，没有新值时，才发送最新的值。

```ts
interval(1000).pipe(debounceTime(2000)).subscribe(value => {
  // 永远也不会输出值，因为每一次新值的间隔都小于 2 秒
  console.log(value);
})
```

### delay

将数据流延迟一段时间发送。

```ts
of('delay').pipe(delay(1000)).subscribe(value => {
  console.log(value)
})
// 1 秒后输出：'dekay'
```

### distinctUntilChanged

过滤连续重复的值。

```ts
of(1, 3, 3, 3, 5, 6, 6).pipe(distinctUntilChanged()).subscribe(value => {
  console.log(value)
})
// 输出：
// 1
// 3
// 5
// 6
```

### filter

过滤源数据流，只发送返回为 true 时的数据。

```ts
of(1, 3, 3, 3, 5, 6, 6).pipe(filter(value => {
  return value > 3;
})).subscribe(value => {
  console.log(value)
})
// 输出：
// 5
// 6
// 6
```

### map

将源数据转换成另外一种数据。

```ts
of('张三').pipe(map(value => {
  return {
    name: value
  }
})).subscribe(value => {
  console.log(value);
})
// 输出： {name: '张三'}
```

### microTask

启动一个微任务，将数据缓存起来，并在微任务执行时，把缓存起来的数据一起发送出去。

```ts
console.log('start')
of(1, 2, 3, 4).pipe(microTask()).subscribe(values => {
  console.log(values)
})
console.log('end')
// 输出：
// start
// end
// [1, 2, 3, 4]
```

### sampleTime

忽略源值，并延迟一段时间，发送最新的值。

```ts
interval(1000).pipe(sampleTime(2000)).subscribe(value => {
  console.log(value);
})
// 输出：
// 3
// 5
// 7
// ...
```

### share

让多个订阅共享同一个数据源，而不是创建新的

```ts
const sharedObs = interval().pipe(share())
sharedObs.subscribe(value => {
  console.log(value)
})

setTimeout(() => {
  sharedObs.subscribe(value => {
    console.log(value)
  })
}, 2100)
// 输出：
// 0
// 1
// 2
// 2
// 3
// 3
```

### skip

跳过指定次数的数据，然后发送后面的值。
```ts
of('A', 'B', 'C', 'D').pipe(skip(2)).subscribe(value => {
  console.log(value);
})
// 输出：
// 'C'
// 'D'
```

### switchMap

返回一个新的数据流，并以新数据流的订阅结果，发送出去。

```ts
of(1).pipe(switchMap(value => {
  return new Observable(subscriber => {
    subscriber.next(value + 1)
  })
})).subscribe(value => {
  console.log(value)
})
// 输出：2
```

### take

指定源数据流最多发送几次。

```ts
of('a', 'b', 'c', 'd').pipe(take(2)).subscribe(value => {
  console.log(value);
})
// 输出：
// 'c'
// 'd'
```

### tap

在数据流中添加副作用。

```ts
of(1, 2).pipe(tap(() => {
  console.log('副作用');
})).subscribe(value => {
  console.log(value);
})
// 输出：
// '副作用'
// '副作用'
// 1
// 2
```

### throttleTime

发出最先到达的值，并忽略一段时间内的新值，然后再发送时间到达之后最新到达的值。

```ts
interval(1000).pipe(throttleTime(2000)).subscribe(value => {
  console.log(value);
})
// 输出：
// 0
// 2
// 4
// 6
// ...
```
