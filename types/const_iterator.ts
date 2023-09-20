import {Map} from "./map.ts";
import {Option} from "./option.ts";
import {type Iterator, IteratorSymbol} from "../traits/iterator.ts";

export const ConstIteratorSymbol = Symbol("ConstIterator");
export type ConstIterator<T extends unknown[]> =
    & { type: symbol, values: T }
    & Iterator<T[number]>;

export namespace ConstIterator {
    export function create<T extends unknown[]>(values: T): ConstIterator<T> {
        const self = {
            type: ConstIteratorSymbol,
            values,
            [IteratorSymbol]: {
                next(): Option<T[number]> {
                    if (values.length > 0) {
                        return Option.Some(values.shift());
                    }

                    return Option.None();
                },
                map<F extends (arg: T[number]) => unknown>(fn: F): Map<ConstIterator<T>, F> {
                    return Map.create(self, fn);
                }
            }
        };

        return self;
    }
}
