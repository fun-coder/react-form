import { Form } from "../Form";

export interface MessageGenerator {
  (fieldName: string, value: any): string
}

export interface Validator<T> {
  validate: (value: T, form: Form) => boolean | Promise<boolean>
  message: MessageGenerator | string,
}

export interface FieldValidator<T> {
  validate: (value: T) => boolean | Promise<boolean>
  message: MessageGenerator | string,
}

export class ValidationError<T> extends Error {
  constructor(public readonly fieldName: string,
              public readonly value: T,
              message: string) {
    super(message);
  }
}
