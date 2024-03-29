export function noop() {
  //
}

export class Subscription {
  private subs: Subscription[] = [];

  private isStopped = false;

  constructor(private unsubscribeCallback?: () => void) {
  }

  add(...subscriptions: Subscription[]) {
    if (this.isStopped) {
      return this;
    }
    this.subs.push(...subscriptions);
    return this
  }

  unsubscribe() {
    this.isStopped = true;
    if (this.unsubscribeCallback) {
      this.unsubscribeCallback();
      this.unsubscribeCallback = noop
    }
    this.subs.forEach(i => i.unsubscribe());
    this.subs = []
  }
}
