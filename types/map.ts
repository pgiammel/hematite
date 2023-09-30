import { Option } from "./option.ts";
import {
  type Iterator,
  IteratorMethods,
  IteratorSymbol,
} from "../traits/iterator.ts";

export class Map<T, U> implements Iterator<U> {
  static #IteratorTraitMethods = class<T, U> implements IteratorMethods<U> {
    #map: Map<T, U>;
    #mapBaseIteratorMethods: IteratorMethods<T>;

    constructor(map: Map<T, U>) {
      this.#map = map;
      this.#mapBaseIteratorMethods = this.#map.#baseIterator[IteratorSymbol]();
    }

    next(): Option<U> {
      return this.#mapBaseIteratorMethods.next().map(this.#map.#func);
    }

    map<V>(fn: (arg: U) => V): Map<U, V> {
      return Map.create(this.#map, fn);
    }
  };

  #baseIterator: Iterator<T>;
  #func: (arg: T) => U;

  constructor(baseIterator: Iterator<T>, func: (arg: T) => U) {
    this.#baseIterator = baseIterator;
    this.#func = func;
  }

  static create<T, U>(iterator: Iterator<T>, fn: (arg: T) => U): Map<T, U> {
    return new Map(iterator, fn);
  }

  [IteratorSymbol](): IteratorMethods<U> {
    return new Map.#IteratorTraitMethods(this);
  }
}
