import { Map } from "./map.ts";
import { Option } from "./option.ts";
import {
  type Iterator,
  IteratorMethods,
  IteratorSymbol,
} from "../traits/iterator.ts";

export class ConstIterator<T> implements Iterator<T> {
  static #IteratorTraitMethods = class<T> implements IteratorMethods<T> {
    #constIterator: ConstIterator<T>;

    constructor(constIterator: ConstIterator<T>) {
      this.#constIterator = constIterator;
    }

    next(): Option<T> {
      const values = this.#constIterator.#values;

      if (values.length > 0) {
        const value: T = values.shift()!;

        return Option.Some(value);
      }

      return Option.None();
    }

    map<ReturnT>(
      fn: <InputT extends T>(arg: InputT) => ReturnT,
    ): Map<T, ReturnT> {
      return Map.create(this.#constIterator, fn);
    }
  };

  #values: T[];

  constructor(values: T[]) {
    this.#values = values;
  }

  static create<T>(values: T[]): ConstIterator<T> {
    return new ConstIterator(values);
  }

  [IteratorSymbol](): IteratorMethods<T> {
    return new ConstIterator.#IteratorTraitMethods(this);
  }
}
