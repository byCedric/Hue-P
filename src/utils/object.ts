/** Determine if the provided value is an object */
export function isObject(item: unknown): item is Record<string, any> {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

/** Merge any `source` object(s) into the `target` object, using deep merge */
export function mergeObjects(target: object, ...sources: object[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeObjects(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeObjects(target, ...sources);
}
