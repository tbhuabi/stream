export class Subscription {
  private subs: Subscription[] = [];

  private isStopped = false;

  constructor(private unsubscribeCallback?: () => void) {
  }

  add(subscription: Subscription) {
    if (this.isStopped) {
      return;
    }
    this.subs.push(subscription);
  }

  unsubscribe() {
    this.isStopped = true;
    if (this.unsubscribeCallback) {
      this.unsubscribeCallback();
    }
    this.subs.forEach(i => i.unsubscribe());
  }
}
