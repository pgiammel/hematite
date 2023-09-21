import { Map } from "./map.ts";
import { Option } from "./option.ts";
import { type Iterator, IteratorSymbol } from "../traits/iterator.ts";

export const ConstIteratorSymbol = Symbol("ConstIterator");
export type ConstIterator<T> =
  & { type: symbol; values: T[] }
  & Iterator<T>;

export namespace ConstIterator {
  export function create<T>(values: T[]): ConstIterator<T> {
    const self = {
      type: ConstIteratorSymbol,
      values,
      [IteratorSymbol]: {
        next(): Option<T> {
          if (values.length > 0) {
            return Option.Some(values.shift()!);
          }

          return Option.None();
        },
        map<F extends (arg: T) => unknown>(
          fn: F,
        ): Map<ConstIterator<T>, F> {
          return Map.create(self, fn);
        },
      },
    };

    return self;
  }
}
