/**
 * Create a new array with the given length.
 * By default, the values within the array are the index itself.
 */
export function createArray(length: number) {
  return Array.from({ length }, (_, i) => i);
}
