import { FormException } from "./form-exception";

export class Form {
  constructor({ subscribers }) {
    console.log('subscribers', subscribers);
    this.fields = new Map();
    this.subscribers = subscribers;
  }

  registerTarget(target) {
    this.target = target;
  }

  mountField(name, field) {
    this.fields.set(name, field);
    // this.startHook(name, field)
  }

  startAllHooks() {
    for(let [name, field] of this.fields) {
      this.startHook(name, field);
    }
  }

  startHook(name, field) {
    const subscribers = this.subscribers.get(name) || new Set();
    console.log('start hook for', name, subscribers);
    for (const { options, subscriber } of subscribers) {
      console.log('options', options.immediate, subscriber.name);
      field.subscribe(
        this.wrapSubscriber(options.valid, subscriber),
        { immediate: options.immediate }
      );
    }
  }

  wrapSubscriber(valid, subscriber) {
    return ({ value, prevValue, message }) => {
      if (valid && message) return;
      subscriber.call(this.target, { value, prevValue, message });
    }
  }

  unmountFiled(name) {
    this.fields.delete(name);
  }

  setFieldValue(name, value) {
    const field = this.fields.get(name);
    if (field) field.setValue(value);
  }

  getField(name) {
    return this.fields.get(name);
  }

  getFieldValue(fieldName) {
    const field = this.fields.get(fieldName);
    return field ? field.getValue() : null;
  }

  notifyChange(fieldName, update) {
    const subscribers = this.subscribers.get(fieldName) || new Set;
    for (const { options, subscriber }  of subscribers) {
      subscriber.call(this.target, update);
    }
  }

  async validate() {
    const errors = [];
    for (const [name, component] of this.fields) {
      const { error, message } = await component.validate();
      if (error) errors.push({ field: name, message });
    }
    if (errors.length > 0) throw new FormException(errors);
  }

  async submit() {
    await this.validate();
    const result = {};
    for (const [name, componentInstance] of this.fields) {
      result[name] = componentInstance.getValue();
    }
    return result;
  }
}
