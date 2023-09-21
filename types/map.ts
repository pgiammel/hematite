import {Option} from "./option.ts";
import {
    type Iterator,
    type IteratorItem,
    IteratorSymbol
} from "../traits/iterator.ts";

export const MapSymbol = Symbol("Map");

export type Map
<Iter extends Iterator<any>, Func extends (arg: IteratorItem<Iter>) => any> =
    & {
        type: symbol;
        iterator: Iter;
        func: Func;
    }
    & Iterator<ReturnType<Func>>

export namespace Map {
    export function create
    <
        Iter extends Iterator<any>,
        Func extends (arg: IteratorItem<Iter>) => any
    >
    (iterator: Iter, func: Func)
    : Map<Iter, Func> {
        const self = {
            type: MapSymbol,
            iterator,
            func,
            [IteratorSymbol]: {
                next(): Option<ReturnType<Func>> {
                    const input = iterator[IteratorSymbol].next();

                    return Option.map(input, func);
                },
                map<NewFunc extends (arg: ReturnType<Func>) => any>
                (fn: NewFunc)
                : Map<Iterator<ReturnType<Func>>, NewFunc> {
                    return Map.create(self, fn);
                }
            }
        };

        return self;
    }
}
