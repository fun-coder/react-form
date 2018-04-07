const watchFieldMetadataKey = 'fnForm:fieldSubscribers';

export const getSubscribers = prototype => {
  let map = Reflect.getMetadata(watchFieldMetadataKey, prototype);
  if (!map) {
    map = new Map();
    Reflect.defineMetadata(watchFieldMetadataKey, map, prototype);
  }
  return map;
};

const defaultOptions = {
  valid: false,
  immediate: true
};

export const watchField = (fieldName, options = {}) => (prototype, propName, listenerDescriptor) => {
  const map = getSubscribers(prototype);
  if (!map.has(fieldName)) map.set(fieldName, new Set());
  map.get(fieldName).add({
    options: Object.assign({}, defaultOptions, options), subscriber: listenerDescriptor.value,
  });
};