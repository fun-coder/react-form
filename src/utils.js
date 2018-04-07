export const callFn = (target, fn, ...args) => {
  if (typeof fn === 'function') {
    fn.apply(target, args);
  }
};

