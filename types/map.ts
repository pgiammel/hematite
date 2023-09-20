import {Option} from "./option.ts";
import {
    type Iterator,
    type IteratorItem,
    IteratorSymbol
} from "../traits/iterator.ts";

export const MapSymbol = Symbol("Map");

export type Map
<I extends Iterator<any>, F extends (arg: IteratorItem<I>) => any> =
    & {
        type: symbol;
        iterator: I;
        func: F;
    }
    & Iterator<ReturnType<F>>

export namespace Map {
    export function create
    <I extends Iterator<any>, F extends (arg: IteratorItem<I>) => any>
    (iterator: I, func: F)
    : Map<I, F> {
        const self = {
            type: MapSymbol,
            iterator,
            func,
            [IteratorSymbol]: {
                next(): Option<ReturnType<F>> {
                    const input = iterator[IteratorSymbol].next();

                    return Option.map(input, func);
                },
                map<F2 extends (arg: ReturnType<F>) => any>(fn: F2)
                : Map<Iterator<ReturnType<F>>, F2> {
                    return Map.create(self, fn);
                }
            }
        };

        return self;
    }
}
