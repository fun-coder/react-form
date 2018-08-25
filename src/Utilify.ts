import { Form } from "./Form";
import { MessageGenerator } from "./types";

interface ValidateFn<T> {
  (value: T, form: Form): boolean | Promise<boolean>
}

export interface Validator<T> {
  validate: (value: T, form: Form) => boolean | Promise<boolean>
  message: MessageGenerator | string,
}

export interface FieldValidator<T> {
  validate: (value: T) => boolean | Promise<boolean>
  message: MessageGenerator | string,
}