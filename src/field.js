import React from "react";
import { Subscribe } from "./subscribe";

export class Field {
  constructor({ validators = [], defaultValue = null }) {
    this.value = defaultValue;
    this.validators = validators;
    this.subscribers = new Subscribe({ value: this.value });
  }

  setValue(value) {
    const prevValue = this.value;
    this.value = value;
    const fixedSubscribers = this.subscribers.fixedVersion();
    this.validate().then(({ message }) => fixedSubscribers.trigger({ value, prevValue, message }));
  }

  getValue() {
    return this.value;
  }

  async validate() {
    const validatorIterator = this.validators[Symbol.iterator]();
    for (let { message, validate } of validatorIterator) {
      const valid = await validate(this.value);
      if (!valid) {
        return { error: true, message };
      }
    }
    return { error: false };
  }

  subscribe(fn, options = { immediate: true }) {
    this.subscribers.add(fn, options);
  }

  destroy() {
    this.subscribers.destroy();
  }
}