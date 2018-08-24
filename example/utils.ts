export const compose = <T>(...handlers: Array<(input: T) => T>) => (initial: T) =>
  handlers.reduce((result, handler) => handler(result), initial);