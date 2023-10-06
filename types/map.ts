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

    map<ReturnT>(
      fn: <InputT extends U>(arg: InputT) => ReturnT,
    ): Map<U, ReturnT> {
      return Map.create(this.#map, fn);
    }
  };

  #baseIterator: Iterator<T>;
  #func: <InputT extends T>(arg: InputT) => U;

  constructor(
    baseIterator: Iterator<T>,
    func: <InputT extends T>(arg: InputT) => U,
  ) {
    this.#baseIterator = baseIterator;
    this.#func = func;
  }

  static create<T, ReturnT>(
    iterator: Iterator<T>,
    fn: <InputT extends T>(arg: InputT) => ReturnT,
  ): Map<T, ReturnT> {
    return new Map<T, ReturnT>(iterator, fn);
  }

  [IteratorSymbol](): IteratorMethods<U> {
    return new Map.#IteratorTraitMethods(this);
  }
}
