import { ConstIterator } from "./const_iterator.ts";
import { hasProperty, isObject } from "./utils.ts";
import {
  type IntoIterator,
  IntoIteratorSymbol,
} from "../traits/into_iterator.ts";

export const OptionSymbol = Symbol("Option");

export type OptionItem<O extends Option<any>> = O extends Option<infer T> ? T
  : never;

/**
 * Type `Option` represents an optional value: ever `Option` is either `Some`
 * and contains a value, or `None`, and does not. `Option` types have a number
 * of uses:
 *
 * - Initial values
 * - Return values for functions that are not defined over their entire input
 * range (partial functions)
 * - Return values for otherwise reporting simple errors, where `None` is
 * returned on error
 * - Optional struct fields
 * - Struct fields that can be loaned or "taken"
 * - Optional function arguments
 * - Nullable pointers
 * - Swapping things out of difficult situations
 */
export type Option<T> =
  & { type: symbol }
  & (
    | { variant: "Some"; value: T }
    | { variant: "None" }
  )
  & IntoIterator<T>;

export namespace Option {
  /**
   * Create a `Some` variant of `Option`, meant to hold some value
   */
  export function Some<T>(value: T): Option<T> {
    return {
      type: OptionSymbol,
      variant: "Some",
      value,
      [IntoIteratorSymbol]: {
        intoIter(): ConstIterator<T> {
          return ConstIterator.create([value]);
        },
      },
    };
  }

  /**
   * Create a `None` variant of `Option`, representing the absence of value
   */
  export function None<T>(): Option<T> {
    return {
      type: OptionSymbol,
      variant: "None",
      [IntoIteratorSymbol]: {
        intoIter(): ConstIterator<T> {
          return ConstIterator.create([]);
        },
      },
    };
  }

  /**
   * @returns Whether `maybeOption` is an `Option`
   */
  export function isOption(
    maybeOption: unknown,
  ): maybeOption is Option<unknown> {
    return (
      isObject(maybeOption) &&
      hasProperty(maybeOption, "type") &&
      maybeOption.type === OptionSymbol
    );
  }

  /**
   * @returns Whether `option` is a `Some` variant of `Option`
   * @see Option.Some
   */
  export function isSome<T>(
    option: Option<T>,
  ): option is Option<T> & { variant: "Some" } {
    return option.variant === "Some";
  }

  /**
   * @returns Whether `option` is a `None` variant of `Option`
   * @see Option.None
   */
  export function isNone<T>(
    option: Option<T>,
  ): option is Option<T> & { variant: "None" } {
    return option.variant === "None";
  }

  /**
   * Map an `Option` on one type to an `Option` on another by applying a
   * function to the inner value if it's a `Some` variant.
   * @param option `Option` to map from
   * @param fn Mapping `function`
   * @returns Mapped `Option`
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

  /**
   * @returns `defaultValue` (if `option` is `None`), or applies a function
   * to the contained value
   */
  export function map_or<T, U>(
    option: Option<T>,
    defaultValue: U,
    fn: (arg: T) => U,
  ): U {
    if (Option.isSome(option)) {
      return fn(option.value);
    }

    return defaultValue;
  }

  /**
   * Computes a default function result (if `option` is `None`), or applies a
   * different function to the contained value
   */
  export function map_or_else<T, U>(
    option: Option<T>,
    defaultFn: () => U,
    mapFn: (arg: T) => U,
  ): U {
    if (Option.isSome(option)) {
      return mapFn(option.value);
    }

    return defaultFn();
  }

  /**
   * @returns `None` if `lhs` is `None`, otherwise returns `rhs`.
   */
  export function and<T, U>(lhs: Option<T>, rhs: Option<U>): Option<U> {
    if (Option.isSome(lhs)) {
      return rhs;
    }

    return Option.None();
  }

  /**
   * @returns `None` if `option` is `None`, otherwise calls `fn` with the
   * wrapped value and returns the result
   */
  export function and_then<T, U>(
    option: Option<T>,
    fn: (arg: T) => Option<U>,
  ): Option<U> {
    if (Option.isSome(option)) {
      return fn(option.value);
    }

    return Option.None();
  }

  /**
   * @return `lhs` if it is not `None`, otherwise return `rhs`
   */
  export function or<T>(lhs: Option<T>, rhs: Option<T>): Option<T> {
    if (Option.isSome(lhs)) {
      return lhs;
    }

    return rhs;
  }

  /**
   * @returns `option` if it is not `None`, otherwise call `fn` and return the
   * result
   */
  export function or_else<T>(option: Option<T>, fn: () => Option<T>): Option<T> {
    if (Option.isSome(option)) {
      return option;
    }

    return fn();
  }
}
