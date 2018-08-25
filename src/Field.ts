import { Optional } from "./Optional";
import { Dict, isFunction, MessageGenerator, ValidationError } from "./types";
import { FieldValidator } from "./Utilify";

export interface FieldChange<T> {
  name: string,
  prev?: T,
  curr: T,
}

const getId = (() => {
  let index = 0;
  return () => index++;
})();

const subscriberKey = '__subscriberKey';

export interface ChangeSubscriber<T> {
  (change: FieldChange<T>): any
}

export interface ErrorSubscriber<T> {
  (error?: ValidationError<T>): any
}

export class Field<T> {
  private changeSubscribers: Dict<ChangeSubscriber<T>> = {};
  private errorSubscribers: Dict<ErrorSubscriber<T>> = {};
  private validators: FieldValidator<T>[] = [];
  private prevValue?: T;
  private error?: ValidationError<T>;

  constructor(private readonly fieldName: string,
              private value?: T) {
  }

  public setValidators(validators?: FieldValidator<T>[]) {
    Optional.of(validators).ifPresent(v => this.validators = v);
  }

  public subscribe(changeSubscriber: ChangeSubscriber<T>, errorSubscriber: ErrorSubscriber<T>) {
    Field.pushSubscriber(changeSubscriber, this.changeSubscribers);
    Field.pushSubscriber(errorSubscriber, this.errorSubscribers);
    changeSubscriber(this.getChange(this.prevValue));
    Optional.of(this.error).ifPresent((error) => this.notifyError(error));
  }

  public unsubscribe(...subscriber: Array<ChangeSubscriber<T> | ErrorSubscriber<T>>): void {
    subscriber.forEach(subscriber => {
      const subscribeKeyDescriber = Object.getOwnPropertyDescriptor(subscriber, subscriberKey);
      Optional.of(subscribeKeyDescriber).ifPresent(describer => {
        delete this.changeSubscribers[describer.value];
        delete this.errorSubscribers[describer.value];
      });
    });
  }

  public setValue(value: any) {
    const prevValue = this.value;
    this.value = value;
    this.notifyChanged(this.getChange(prevValue));
  }

  public async validate() {
    return this.validateValue(this.value)
      .then(() => this.cleanError())
      .catch(error => {
        if (error.fieldName) {
          this.setError(error);
        }
        throw error;
      });
  }

  private validateValue(value: any): Promise<void> {
    return this.validators.reduce(
      (chain, validator) => chain.then(() => this.execValidator(validator, value)),
      Promise.resolve()
    );
  }

  public getValue() {
    return this.value;
  }

  public getError(): ValidationError<T>|undefined {
    return this.error;
  }

  public getValidValue(): Promise<any> {
    return this.validate().then(() => this.value);
  }

  getChange(prevValue: any = this.prevValue): FieldChange<any> {
    return { prev: prevValue, curr: this.value, name: this.fieldName };
  }

  private async execValidator(validator: FieldValidator<T>, value: T) {
    const successful = await validator.validate(value);
    if (!successful) {
      const message = isFunction(validator.message)
        ? (validator.message as MessageGenerator)(this.fieldName, value)
        : validator.message as string;
      throw new ValidationError(this.fieldName, value, message);
    }
  }

  private notifyChanged(change: FieldChange<any>) {
    for (const subscriberId in this.changeSubscribers) {
      this.changeSubscribers[subscriberId](change);
    }
  }

  private notifyError(error?: ValidationError<T>) {
    for (const subscriberId in this.errorSubscribers) {
      this.errorSubscribers[subscriberId](error);
    }
  }

  private static pushSubscriber<T>(subscriber: T,
                                   subscribers: Dict<T>) {
    let describer = Object.getOwnPropertyDescriptor(subscriber, subscriberKey);
    if (!describer) {
      describer = { enumerable: true, writable: false, value: getId(), configurable: false };
      Object.defineProperty(subscriber, subscriberKey, describer);
    }
    subscribers[describer.value] = subscriber;
  }

  public cleanError() {
    this.setError(undefined);
  }

  private setError(error?: ValidationError<T>) {
    if (!this.error && !error) {
      return;
    }
    if (this.error && error && error.message === this.error.message) {
      return
    }
    this.error = error;
    this.notifyError(error);
  }
}