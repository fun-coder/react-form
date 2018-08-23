import { Optional } from "./Optional";
import { Dict, ValidationError, Validator } from "./types";

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

export interface ChangeSubscriber {
  (change: FieldChange<any>): any
}

export interface ErrorSubscriber {
  (error?: ValidationError): any
}

export class Field {
  private changeSubscribers: Dict<ChangeSubscriber> = {};
  private errorSubscribers: Dict<ErrorSubscriber> = {};
  private validators: Validator[] = [];
  private prevValue?: any;
  private error?: ValidationError;

  constructor(private readonly fieldName: string,
              private value: any) {
  }

  public setValidators(validators?: Validator[]) {
    Optional.of(validators).ifPresent(v => this.validators = v);
  }

  public subscribe<T>(changeSubscriber: ChangeSubscriber, errorSubscriber: ErrorSubscriber) {
    Field.pushSubscriber(changeSubscriber, this.changeSubscribers);
    Field.pushSubscriber(errorSubscriber, this.errorSubscribers);
    changeSubscriber(this.getChange(this.prevValue));
    Optional.of(this.error).ifPresent((error) => this.notifyError(error));
  }

  public unsubscribe<T>(...subscriber: Array<ChangeSubscriber | ErrorSubscriber>): void {
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

  public getValidValue(): Promise<any> {
    return this.validate().then(() => this.value);
  }

  getChange(prevValue: any = this.prevValue): FieldChange<any> {
    return { prev: prevValue, curr: this.value, name: this.fieldName };
  }

  private async execValidator(validator: Validator, value: any) {
    const successful = await validator.validate(value);
    if (!successful) {
      throw new ValidationError(this.fieldName, validator.message);
    }
  }

  private notifyChanged(change: FieldChange<any>) {
    for (const subscriberId in this.changeSubscribers) {
      this.changeSubscribers[subscriberId](change);
    }
  }

  private notifyError(error?: ValidationError) {
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

  private cleanError() {
    this.setError(undefined);
  }

  private setError(error?: ValidationError) {
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