import { ConstIterator } from "./const_iterator.ts";
import {
  type IntoIterator,
  IntoIteratorMethods,
  IntoIteratorSymbol,
} from "../traits/into_iterator.ts";
import type { Iterator } from "../traits/iterator.ts";
import { UnwrapError } from "./error.ts";

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

  isOk(): this is Ok<T, E> {
    return this instanceof Ok;
  }

  isErr(): this is Err<T, E> {
    return this instanceof Err;
  }

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

  unwrap(): T {
    return this.#data;
  }

  unwrapErr(): E {
    throw new UnwrapError();
  }

  map<U>(fn: (arg: T) => U): Result<U, E> {
    return Result.Ok(fn(this.#data));
  }

  [IntoIteratorSymbol](): IntoIteratorMethods<T> {
    const data = this.#data;

    return {
      intoIter(): Iterator<T> {
        return ConstIterator.create([data]);
      },
    };
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

  unwrap(): T {
    throw new UnwrapError();
  }

  unwrapErr(): E {
    return this.#error;
  }

  map<U>(_fn: (arg: T) => U): Result<U, E> {
    return Result.Err(this.#error);
  }

  [IntoIteratorSymbol](): IntoIteratorMethods<T> {
    return {
      intoIter(): Iterator<T> {
        return ConstIterator.create<T>([]);
      },
    };
  }
}
