import { fromPromise, Subject, switchMap } from "@tanbo/stream";

const subject = new Subject<void>()

const sub = subject.asObservable().subscribe(() => {
  console.log('sss')
})



sub.unsubscribe()

// subject.complete()

console.log(subject)
