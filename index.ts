import { fromPromise, Subject, switchMap } from "@tanbo/stream";

const subject = new Subject<void>()

subject.pipe(switchMap(() => {
  return fromPromise(Promise.resolve(333))
})).subscribe(a => {
  console.log(a)
})

setInterval(() => {
  subject.next()
}, 1000)
