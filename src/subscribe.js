export class Subscribe {
  constructor(defaultValue) {
    this.subscribers = [];
    this.value = defaultValue;
  }

  trigger(value) {
    this.subscribers.forEach(subscriber => subscriber(value));
  }

  add(fn, options) {
    console.log('options', options, this.value);
    this.subscribers = this.subscribers.concat([fn]);
    if (options.immediate) fn(this.value);
  }

  destroy() {
    this.subscribers.clear();
  }

  fixedVersion() {
    const subscribe = new Subscribe(this.value);
    subscribe.subscribers = this.subscribers;
    return subscribe;
  }
}