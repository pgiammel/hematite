import type {Iterator} from "./iterator.ts";

export const IntoIteratorSymbol = Symbol("IntoIterator");

export type IntoIteratorItem<I extends IntoIterator<unknown>> =
    I extends IntoIterator<infer T> ? T : never;
export interface IntoIterator<T> {
    [IntoIteratorSymbol]: {
        intoIter(): Iterator<T>;
    }
}

export namespace IntoIterator {
    export function intoIter<T extends IntoIterator<any>>(obj: T)
    : Iterator<IntoIteratorItem<T>> {
        return obj[IntoIteratorSymbol].intoIter();
    }
}
