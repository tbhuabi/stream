export class Subscription {
  constructor(public unsubscribe: () => void) {
  }
}
