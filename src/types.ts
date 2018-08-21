export type Dict<T> = {
  [key: string]: T
}

export const formKey = '__rnForm';

export interface Validation {
  successful: boolean,
  message?: string
}

export interface Validator {
  validate: (value: any) => boolean | Promise<boolean>
  message: string
}

export class ValidationError extends Error {
  constructor(public readonly fieldName: string,
              message: string) {
    super(message);
  }
}