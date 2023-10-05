import { ConstIterator } from "./const_iterator.ts";
import {
  type IntoIterator,
  IntoIteratorMethods,
  IntoIteratorSymbol,
} from "../traits/into_iterator.ts";
import { TwoTuple } from "../utils/tuple.ts";
import { UnwrapError } from "./error.ts";
import { Result } from "./result.ts";

export type OptionItem<T> = T extends Option<infer U> ? U : never;

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
export abstract class Option<T> implements IntoIterator<T> {
  /**
   * Create a `Some` variant of `Option`, meant to hold some value
   */
  static Some<U>(value: U): Option<U> {
    return new Some(value);
  }

  /**
   * Create a `None` variant of `Option`, representing the absence of value
   */
  static None<U>(): Option<U> {
    return new None<U>();
  }

  /**
   * @returns Whether `this` is a `Some` variant of `Option`
   * @see Option.Some
   */
  isSome(): this is Some<T> {
    return this instanceof Some;
  }

  /**
   * @returns Whether `this` is a `None` variant of `Option`
   * @see Option.None
   */
  isNone(): this is None<T> {
    return this instanceof None;
  }

  /**
   * @returns The contained value if `this` is `Some`, otherwise throw
   * `UnwrapError`
   */
  abstract unwrap(): T;

  /**
   * @returns The contained value if `this` is `Some`, otherwise `defaultValue`
   */
  abstract unwrapOr(defaultValue: T): T;

  /**
   * @returns The contained `Some` value or computes it from a `fn`.
   */
  abstract unwrapOrElse(fn: () => T): T;

  /**
   * Map `this` to an `Option` on another type by applying a
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
  abstract map<U>(fn: (value: T) => U): Option<U>;

  /**
   * @returns `defaultValue` (if `this` is `None`), or applies a function
   * to the contained value
   */
  abstract mapOr<U>(defaultValue: U, fn: (arg: T) => U): U;

  /**
   * Computes a default function result (if `this` is `None`), or applies a
   * different function to the contained value
   */
  abstract mapOrElse<U>(defaultFn: () => U, mapFn: (arg: T) => U): U;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to
   * `Ok(v)` and `None` to `Err(err)`.
   */
  abstract okOr<E>(err: E): Result<T, E>;

  abstract okOrElse<E>(fn: () => E): Result<T, E>;

  /**
   * @returns `None` if `this` is `None`, otherwise returns `other`.
   */
  abstract and<U>(other: Option<U>): Option<U>;

  /**
   * @returns `None` if `this` is `None`, otherwise calls `fn` with the
   * wrapped value and returns the result
   */
  abstract andThen<U>(fn: (arg: T) => Option<U>): Option<U>;

  /**
   * @returns `None` if `this` is `None`, otherwise calls `fn` with the wrapped
   * value and returns
   *
   * `Some(t)` if `fn` returns true (where `t` is the wrapped value), and `None`
   * if `fn` returns false.
   *
   * This function works similar to `Iterator::filter()`. You can imagine the
   * `Option<T>` being an iterator over one or zero elements. `filter()` lets
   * you decide which elements to keep.
   */
  abstract filter(fn: (arg: T) => boolean): Option<T>;

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`.
   */
  abstract flatten(this: Option<Option<OptionItem<T>>>): Option<OptionItem<T>>;

  /**
   * @return `this` if it is not `None`, otherwise return `other`
   */
  abstract or(other: Option<T>): Option<T>;

  /**
   * @returns `this` if it is not `None`, otherwise call `fn` and return the
   * result
   */
  abstract orElse(fn: () => Option<T>): Option<T>;

  /**
   * @returns `this` if only `this` is `Some`, `other` if only `other` is `Some`,
   * otherwise returns `None`
   */
  abstract xor(other: Option<T>): Option<T>;

  /**
   * Zips `this` with another option.
   * @returns `Some<[T, U]>` if both `this` and `other` are `Some`, otherwise
   * `None`
   */
  abstract zip<U>(rhs: Option<U>): Option<[T, U]>;

  /**
   * Unzips `this` into a 2-tuple of options.
   * @returns `[Some<T>, Some<U>]` if `option` is `Some<[T, U]>`, otherwise
   * `[None<T>, None<U>]`
   */
  abstract unzip(
    this: Option<[TwoTuple<T>[0], TwoTuple<T>[1]]>,
  ): [Option<TwoTuple<T>[0]>, Option<TwoTuple<T>[1]>];

  abstract [IntoIteratorSymbol](): IntoIteratorMethods<T>;
}

export class Some<T> extends Option<T> {
  #value: T;

  constructor(value: T) {
    super();
    this.#value = value;
  }

  unwrap(): T {
    return this.#value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.#value;
  }

  unwrapOrElse(_fn: () => T): T {
    return this.#value;
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return Option.Some(fn(this.#value));
  }

  mapOr<U>(_defaultValue: U, fn: (arg: T) => U): U {
    return fn(this.#value);
  }

  mapOrElse<U>(_defaultFn: () => U, mapFn: (arg: T) => U): U {
    return mapFn(this.#value);
  }

  okOr<E>(_err: E): Result<T, E> {
    return Result.Ok<T, E>(this.#value);
  }

  okOrElse<E>(_fn: () => E): Result<T, E> {
    return Result.Ok<T, E>(this.#value);
  }

  and<U>(other: Option<U>): Option<U> {
    return other;
  }

  andThen<U>(fn: (arg: T) => Option<U>): Option<U> {
    return fn(this.#value);
  }

  filter(fn: (arg: T) => boolean): Option<T> {
    if (fn(this.#value)) {
      return this;
    }

    return Option.None();
  }

  flatten(this: Some<Option<OptionItem<T>>>): Option<OptionItem<T>> {
    return this.#value;
  }

  or(_other: Option<T>): Option<T> {
    return this;
  }

  orElse(_fn: () => Option<T>): Option<T> {
    return this;
  }

  xor(other: Option<T>): Option<T> {
    if (other.isNone()) {
      return this;
    }

    return Option.None();
  }

  zip<U>(rhs: Option<U>): Option<[T, U]> {
    if (rhs.isSome()) {
      return Option.Some([this.#value, rhs.#value]);
    }

    return Option.None();
  }

  unzip(
    this: Some<[TwoTuple<T>[0], TwoTuple<T>[1]]>,
  ): [Option<TwoTuple<T>[0]>, Option<TwoTuple<T>[1]>] {
    return [
      Option.Some(this.#value[0]),
      Option.Some(this.#value[1]),
    ];
  }

  [IntoIteratorSymbol](): IntoIteratorMethods<T> {
    const value = this.#value;

    return {
      intoIter(): ConstIterator<T> {
        return ConstIterator.create([value]);
      },
    };
  }

  [Symbol.for("Deno.customInspect")](
    inspect: typeof Deno.inspect,
    options: Deno.InspectOptions,
  ): string {
    return `Some(${inspect(this.#value, options)})`;
  }
}

export class None<T> extends Option<T> {
  unwrap(): T {
    throw new UnwrapError();
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fn: () => T): T {
    return fn();
  }

  map<U>(_fn: (value: T) => U): Option<U> {
    return Option.None();
  }

  mapOr<U>(defaultValue: U, _fn: (arg: T) => U): U {
    return defaultValue;
  }

  mapOrElse<U>(defaultFn: () => U, _mapFn: (arg: T) => U): U {
    return defaultFn();
  }

  okOr<E>(err: E): Result<T, E> {
    return Result.Err(err);
  }

  okOrElse<E>(fn: () => E): Result<T, E> {
    return Result.Err<T, E>(fn());
  }

  and<U>(_other: Option<U>): Option<U> {
    return Option.None();
  }

  andThen<U>(_fn: (arg: T) => Option<U>): Option<U> {
    return Option.None();
  }

  filter(_fn: (arg: T) => boolean): Option<T> {
    return this;
  }

  flatten(this: None<Option<OptionItem<T>>>): Option<OptionItem<T>> {
    return Option.None();
  }

  or(other: Option<T>): Option<T> {
    return other;
  }

  orElse(fn: () => Option<T>): Option<T> {
    return fn();
  }

  xor(other: Option<T>): Option<T> {
    if (other.isSome()) {
      return other;
    }

    return Option.None();
  }

  zip<U>(_rhs: Option<U>): Option<[T, U]> {
    return Option.None();
  }

  unzip(
    this: None<[TwoTuple<T>[0], TwoTuple<T>[1]]>,
  ): [Option<TwoTuple<T>[0]>, Option<TwoTuple<T>[1]>] {
    return [
      Option.None(),
      Option.None(),
    ];
  }

  [IntoIteratorSymbol](): IntoIteratorMethods<T> {
    return {
      intoIter(): ConstIterator<T> {
        return ConstIterator.create<T>([]);
      },
    };
  }

  [Symbol.for("Deno.customInspect")](): string {
    return "None";
  }
}
