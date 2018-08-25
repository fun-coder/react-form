export type Dict<T> = {
  [key: string]: T
}

export const formKey = '__rnForm';

export interface Validation {
  successful: boolean,
  message?: string
}

export interface MessageGenerator {
  (fieldName: string, value: any): string
}

export class ValidationError<T> extends Error {
  constructor(public readonly fieldName: string,
              public readonly value: T,
              message: string) {
    super(message);
  }
}

export const isFunction = (target: any) => typeof(target) === 'function';
