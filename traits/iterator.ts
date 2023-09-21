import { Option } from "../types/option.ts";
import { Map } from "../types/map.ts";
import { hasProperty, isObject } from "../types/utils.ts";

export type IteratorItem<I extends Iterator<unknown>> = I extends
  Iterator<infer T> ? T : never;

export const IteratorSymbol = Symbol("Iterator");

export interface Iterator<T> {
  [IteratorSymbol]: {
    next(): Option<T>;
    map<F extends (arg: T) => any>(fn: F): Map<Iterator<T>, F>;
  };
}

type IsSameItem<T, I extends Iterator<T>> = T extends IteratorItem<I> ? true
  : IteratorItem<I> extends T ? true
  : never;

export namespace Iterator {
  export function isIterator(
    maybeIterator: unknown,
  ): maybeIterator is Iterator<unknown> {
    return (
      isObject(maybeIterator) &&
      hasProperty(maybeIterator, IteratorSymbol)
    );
  }

  export function next<I extends Iterator<any>>(
    iterator: I,
  ): Option<IteratorItem<I>> {
    return iterator[IteratorSymbol].next();
  }

  export function map<
    I extends Iterator<any>,
    F extends (args: IteratorItem<I>) => any,
  >(iterator: I, fn: F): Map<Iterator<IteratorItem<I>>, F> {
    return iterator[IteratorSymbol].map(fn);
  }
}
