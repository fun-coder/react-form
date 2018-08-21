import { Optional } from "./optional";
import { Dict, ValidationError, Validator } from "./types";

export interface FieldChange<T> {
  name: string,
  prev?: T,
  curr: T,
  errorMsg?: string
}

const getId = (() => {
  let index = 0;
  return () => index++;
})();

const subscriberKey = '__subscriberKey';

interface Subscriber {
  (target: any): any
}

export interface ChangeSubscriber extends Subscriber {
  <T>(change: FieldChange<T>, error?: ValidationError): any
}

export class Field {
  private subscribers: Dict<ChangeSubscriber> = {};
  private validators: Validator[] = [];
  private prevValue?: any;

  constructor(private readonly fieldName: string,
              private value: any) {
  }

  setValidators(validators?: Validator[]) {
    Optional.of(validators).ifPresent(v => this.validators = v);
  }

  public subscribe<T>(subscriber: ChangeSubscriber) {
    Field.pushSubscriber(subscriber, this.subscribers);
    subscriber(this.getChange(this.prevValue));
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

  public unsubscribe<T>(...subscriber: Subscriber[]): void {
    subscriber.forEach(subscriber => {
      const subscribeKeyDescriber = Object.getOwnPropertyDescriptor(subscriber, subscriberKey);
      Optional.of(subscribeKeyDescriber).ifPresent(describer => {
        delete this.subscribers[describer.value];
      });
    });
  }

  public unsubscribeAll(): void {
    this.subscribers = {};
  }

  public setValue(value: any) {
    const prevValue = this.value;
    this.value = value;
    this.notifyChanged(this.getChange(prevValue));
  }

  validate(value: any): Promise<void> {
    return this.validators.reduce(
      (chain, validator) => chain.then(() => this.execValidator(validator, value)),
      Promise.resolve()
    );
  }

  public getValue() {
    return this.value;
  }

  public getValidValue(): Promise<any> {
    const value = this.value;
    return this.validate(value)
      .then(() => {
        this.notifyChanged(this.getChange());
        return value;
      })
      .catch(error => {
        if (error.fieldName) {
          this.notifyChanged(this.getChange(this.value), error);
        }
        throw error;
      })
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

  private notifyChanged(change: FieldChange<any>, error?: ValidationError) {
    for (const subscriberId in this.subscribers) {
      this.subscribers[subscriberId](change, error);
    }
  }
}