import { Option } from "../types/option.ts";
import { Map } from "../types/map.ts";
import { hasProperty, isObject } from "../types/utils.ts";

export const IteratorSymbol = Symbol("Iterator");

export interface IteratorMethods<T> {
  next(): Option<T>;
  map<U>(fn: (arg: T) => U): Map<T, U>;
}

export interface Iterator<T> {
  [IteratorSymbol](): IteratorMethods<T>;
}

export namespace Iterator {
  export function isIterator(
    maybeIterator: unknown,
  ): maybeIterator is Iterator<unknown> {
    return (
      isObject(maybeIterator) &&
      hasProperty(maybeIterator, IteratorSymbol)
    );
  }

  export function next<T>(iterator: Iterator<T>): Option<T> {
    return iterator[IteratorSymbol]().next();
  }

  export function map<T, U>(
    iterator: Iterator<T>,
    fn: (arg: T) => U,
  ): Map<T, U> {
    return iterator[IteratorSymbol]().map(fn);
  }

  /**
   * Create a native `globalThis.IterableIterator<T>` from an `Iterator<T>`
   */
  export function* nativeIterableIterator<T>(
    iterator: Iterator<T>,
  ): globalThis.IterableIterator<T> {
    let item: Option<T>;
    const traitMethods = iterator[IteratorSymbol]();

    while ((item = traitMethods.next()).isSome()) {
      yield item.unwrap();
    }
  }
}
