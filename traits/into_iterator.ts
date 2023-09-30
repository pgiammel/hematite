import type { Iterator } from "./iterator.ts";

export const IntoIteratorSymbol = Symbol("IntoIterator");

export interface IntoIteratorMethods<T> {
  intoIter(): Iterator<T>;
}
export interface IntoIterator<T> {
  [IntoIteratorSymbol](): IntoIteratorMethods<T>;
}

export namespace IntoIterator {
  export function intoIter<T>(obj: IntoIterator<T>): Iterator<T> {
    return obj[IntoIteratorSymbol]().intoIter();
  }
}
