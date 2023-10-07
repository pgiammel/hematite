import { ConstIterator } from "./const_iterator.ts";
import {
  type IntoIterator,
  IntoIteratorMethods,
  IntoIteratorSymbol,
} from "../traits/into_iterator.ts";
import type { Iterator } from "../traits/iterator.ts";
import { UnwrapError } from "./error.ts";
import { Option } from "./option.ts";

/**
 * `Result<T, E>` is the type used for returning and propagating errors. It is
 * an enum with the variants, `Ok(T)`, representing success and containing a
 * value, and `Err(E)`, representing error and containing an error value.
 *
 * Functions return `Result` whenever errors are expected and recoverable.
 */
export abstract class Result<T, E> implements IntoIterator<T> {
  static Ok<T, E>(data: T) {
    return new Ok<T, E>(data);
  }

  static Err<T, E>(error: E) {
    return new Err<T, E>(error);
  }

  /**
   * @returns `rhs` if the result is `Ok`, otherwise returns the `Err` value of
   * self.
   */
  abstract and<U>(rhs: Result<U, E>): Result<U, E>;

  /**
   * Calls `fn` if the result is `Ok`, otherwise returns the `Err` value of
   * self.
   *
   * This function can be used for control flow based on `Result` values.
   */
  abstract andThen<U>(fn: (arg: T) => Result<U, E>): Result<U, E>;

  /**
   * Converts from `Result<T, E>` to `Option<E>`.
   */
  abstract err(): Option<E>;

  /**
   * Converts from `Result<Result<T, E>, E>` to `Result<T, E>`
   */
  abstract flatten<U>(this: Result<Result<U, E>, E>): Result<U, E>;

  isOk(): this is Ok<T, E> {
    return this instanceof Ok;
  }

  /**
   * @returns `true` if the result is `Ok` and the value inside of it matches a
   * predicate
   */
  abstract isOkAnd(fn: (arg: T) => boolean): boolean;

  isErr(): this is Err<T, E> {
    return this instanceof Err;
  }

  /**
   * @returns `true` if the result is `Err` and the value inside of it matches a
   * predicate
   */
  abstract isErrAnd(fn: (arg: E) => boolean): boolean;

  /**
   * @returns The contained data if `this` is `Ok`, otherwise throw
   * `UnwrapError`
   */
  abstract unwrap(): T;

  /**
   * @returns The contained error if `this` is `Err`, otherwise throw
   * `UnwrapError`
   */
  abstract unwrapErr(): E;

  /**
   * @returns The contained `Ok` value or a provided default
   */
  abstract unwrapOr(defaultData: T): T;

  /**
   * @returns The contained `Ok` value or computes it from a closure
   */
  abstract unwrapOrElse(defaultFn: (arg: E) => T): T;

  /**
   * Map `this` to a Result on another successful type by applying a function
   * to the inner data if it's an `Ok` variant.
   * @param result `Result` to map from
   * @param fn Mapping `function`
   * @returns Mapped `Result`
   *
   * @example
   * // Result<string, unknown>
   * // Result.Ok("5.00")
   * Result.map(Result.Ok(5), n => n.toFixed(2));
   *
   * @example
   * // Result<string, boolean>
   * // Result.Err(false)
   * Result.map(Result.Err<number, boolean>(false), n => n.toFixed(2));
   */
  abstract map<U>(fn: (arg: T) => U): Result<U, E>;

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
   * contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   */
  abstract mapErr<F>(fn: (arg: E) => F): Result<T, F>;

  /**
   * @returns the provided `defaultValue` (if `Err`), or applies a function to
   * the contained value (if `Ok`).
   */
  abstract mapOr<U>(defaultValue: U, fn: (arg: T) => U): U;

  /**
   * Maps a `Result<T, E>` to U by applying fallback function `defaultFn` to a
   * contained `Err` value, or function `mapFn` to a contained `Ok` value.
   *
   * This function can be used to unpack a successful result while handling an
   * error.
   */
  abstract mapOrElse<U>(defaultFn: (arg: E) => U, mapFn: (arg: T) => U): U;

  /**
   * Converts from `Result<T, E>` to `Option<T>`
   */
  abstract ok(): Option<T>;

  /**
   * @returns `rhs` if the result is `Err`, otherwise returns the `Ok` value of
   * self
   */
  abstract or(rhs: Result<T, E>): Result<T, E>;

  /**
   * Calls `fn` if the result is `Err`, otherwise returns the `Ok` value of self
   *
   * This function can be used for control flow based on result values.
   */
  abstract orElse<F>(fn: (arg: E) => Result<T, F>): Result<T, F>;

  /**
   * Transposes a `Result` of an `Option` into an `Option` of a `Result`.
   *
   * `Ok(None)` will be mapped to `None`. `Ok(Some(_))` and `Err(_)` will be
   * mapped to `Some(Ok(_))` and `Some(Err(_))`.
   */
  abstract transpose<U>(this: Result<Option<U>, E>): Option<Result<U, E>>;

  abstract [IntoIteratorSymbol](): IntoIteratorMethods<T>;
}

export class Ok<T, E> extends Result<T, E> {
  #data: T;

  constructor(data: T) {
    super();
    this.#data = data;
  }

  and<U>(rhs: Result<U, E>): Result<U, E> {
    return rhs;
  }

  andThen<U>(fn: (arg: T) => Result<U, E>): Result<U, E> {
    return fn(this.#data);
  }

  err(): Option<E> {
    return Option.None();
  }

  flatten<U>(this: Ok<Result<U, E>, E>): Result<U, E> {
    return this.#data;
  }

  isOkAnd(fn: (arg: T) => boolean): boolean {
    return fn(this.#data);
  }

  isErrAnd(_fn: (arg: E) => boolean): boolean {
    return false;
  }

  unwrap(): T {
    return this.#data;
  }

  unwrapErr(): E {
    throw new UnwrapError();
  }

  unwrapOr(_defaultData: T): T {
    return this.#data;
  }

  unwrapOrElse(_defaultFn: (arg: E) => T): T {
    return this.#data;
  }

  map<U>(fn: (arg: T) => U): Result<U, E> {
    return Result.Ok(fn(this.#data));
  }

  mapErr<F>(_fn: (arg: E) => F): Result<T, F> {
    return Result.Ok(this.#data);
  }

  mapOr<U>(_defaultValue: U, fn: (arg: T) => U): U {
    return fn(this.#data);
  }

  mapOrElse<U>(_defaultFn: (arg: E) => U, mapFn: (arg: T) => U): U {
    return mapFn(this.#data);
  }

  ok(): Option<T> {
    return Option.Some(this.#data);
  }

  or(_rhs: Result<T, E>): Result<T, E> {
    return this;
  }

  orElse<F>(_fn: (arg: E) => Result<T, F>): Result<T, F> {
    return Result.Ok(this.#data);
  }

  transpose<U>(this: Ok<Option<U>, E>): Option<Result<U, E>> {
    return this.#data.map((v) => Result.Ok(v));
  }

  [IntoIteratorSymbol](): IntoIteratorMethods<T> {
    const data = this.#data;

    return {
      intoIter(): Iterator<T> {
        return ConstIterator.create([data]);
      },
    };
  }

  [Symbol.for("Deno.customInspect")](
    inspect: typeof Deno.inspect,
    options: Deno.InspectOptions,
  ): string {
    const depth = options.depth ?? 0;

    if (depth > 1) {
      return `Ok(${inspect(
        this.#data,
        {
          ...options,
          depth: depth - 1,
        }
      )})`;
    }

    return "Ok(...)";
  }
}

export class Err<T, E> extends Result<T, E> {
  #error: E;

  constructor(error: E) {
    super();
    this.#error = error;
  }

  and<U>(_rhs: Result<U, E>): Result<U, E> {
    return Result.Err(this.#error);
  }

  andThen<U>(_fn: (arg: T) => Result<U, E>): Result<U, E> {
    return Result.Err(this.#error);
  }

  err(): Option<E> {
    return Option.Some(this.#error);
  }

  flatten<U>(this: Err<Result<U, E>, E>): Result<U, E> {
    return Result.Err(this.#error);
  }

  isOkAnd(_fn: (arg: T) => boolean): boolean {
    return false;
  }

  isErrAnd(fn: (arg: E) => boolean): boolean {
    return fn(this.#error);
  }

  unwrap(): T {
    throw new UnwrapError();
  }

  unwrapErr(): E {
    return this.#error;
  }

  unwrapOr(defaultData: T): T {
    return defaultData;
  }

  unwrapOrElse(defaultFn: (arg: E) => T): T {
    return defaultFn(this.#error);
  }

  map<U>(_fn: (arg: T) => U): Result<U, E> {
    return Result.Err(this.#error);
  }

  mapErr<F>(fn: (arg: E) => F): Result<T, F> {
    return Result.Err(fn(this.#error));
  }

  mapOr<U>(defaultValue: U, _fn: (arg: T) => U): U {
    return defaultValue;
  }

  mapOrElse<U>(defaultFn: (arg: E) => U, _mapFn: (arg: T) => U): U {
    return defaultFn(this.#error);
  }

  ok(): Option<T> {
    return Option.None();
  }

  or(rhs: Result<T, E>): Result<T, E> {
    return rhs;
  }

  orElse<F>(fn: (arg: E) => Result<T, F>): Result<T, F> {
    return fn(this.#error);
  }

  transpose<U>(this: Err<Option<U>, E>): Option<Result<U, E>> {
    return Option.Some(Result.Err(this.#error));
  }

  [IntoIteratorSymbol](): IntoIteratorMethods<T> {
    return {
      intoIter(): Iterator<T> {
        return ConstIterator.create<T>([]);
      },
    };
  }

  [Symbol.for("Deno.customInspect")](
    inspect: typeof Deno.inspect,
    options: Deno.InspectOptions,
  ): string {
    const depth = options.depth ?? 0;

    if (depth > 1) {
      return `Err(${
        inspect(
          this.#error,
          {
            ...options,
            depth: depth - 1,
          }
        )})`;
    }

    return "Err(...)";
  }
}
