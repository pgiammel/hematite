import {ConstIterator} from "./const_iterator.ts";
import {hasProperty, isObject} from "./utils.ts";
import {
    type IntoIterator,
    IntoIteratorSymbol
} from "../traits/into_iterator.ts";

export const OptionSymbol = Symbol("Option");

export type OptionItem<O extends Option<any>> =
    O extends Option<infer T> ? T : never;
export type Option<T> =
    & { type: symbol }
    & (
        | { variant: "Some", value: T }
        | { variant: "None" }
    )
    & IntoIterator<T>;

export namespace Option {
    export function Some<T>(value: T): Option<T> {
        return {
            type: OptionSymbol,
            variant: "Some",
            value,
            [IntoIteratorSymbol]: {
                into_iter(): ConstIterator<[T]> {
                    return ConstIterator.create([value]);
                }
            }
        };
    }

    export function None<T>(): Option<T> {
        return {
            type: OptionSymbol,
            variant: "None",
            [IntoIteratorSymbol]: {
                into_iter(): ConstIterator<T[]> {
                    return ConstIterator.create([]);
                }
            }
        };
    }

    /**
     * @returns Whether `maybeOption` is an Option<T>
     */
    export function isOption(maybeOption: unknown)
    : maybeOption is Option<unknown> {
        return (
            isObject(maybeOption)
            && hasProperty(maybeOption, "type")
            && maybeOption.type === OptionSymbol
        );
    }

    /**
     * @returns Whether `option` is a Some variant of Option<T>
     * @see Option.Some
     */
    export function isSome<T>(option: Option<T>)
    : option is Option<T> & { variant: "Some" } {
        return option.variant === "Some";
    }

    /**
     * @returns Whether `option` is a None variant of Option<T>
     * @see Option.None
     */
    export function isNone<T>(option: Option<T>)
    : option is Option<T> & { variant: "None" } {
        return option.variant === "None";
    }

    /**
     * Map an Option on one type to an Option on another by applying a function
     * to the inner value if it's a Some variant.
     * @param option Option to map from
     * @param fn Mapping function
     * @returns Mapped Option
     *
     * @example
     * // Option<string>
     * // Option.Some("5.00")
     * Option.map(Option.Some(5), n => n.toFixed(2));
     *
     * @example
     * // Option<string>
     * // Option.None()
     * Option.map(Option.None<number>(), n => n.toFixed(2));
     */
    export function map<T, U>(option: Option<T>, fn: (arg: T) => U): Option<U> {
        if (Option.isSome(option)) {
            return Option.Some(fn(option.value));
        }

        return Option.None();
    }
}
