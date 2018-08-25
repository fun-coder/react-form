export type Dict<T> = {
  [key: string]: T
}

export const formKey = '__rnForm';

export const isFunction = (target: any) => typeof(target) === 'function';
