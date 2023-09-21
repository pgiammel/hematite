import {hasProperty, isObject} from "./utils.ts";
import {ConstIterator} from "./const_iterator.ts";
import {
    type IntoIterator,
    IntoIteratorSymbol
} from "../traits/into_iterator.ts";
import type {Iterator} from "../traits/iterator.ts";

export const ResultSymbol = Symbol("Result");

/**
 * `Result<T, E>` is the type used for returning and propagating errors. It is
 * an enum with the variants, `Ok(T)`, representing success and containing a
 * value, and `Err(E)`, representing error and containing an error value.
 *
 * Functions return `Result` whenever errors are expected and recoverable.
 */
export type Result<T, E> =
    & { type: symbol }
    & (
        | { variant: "Ok", data: T }
        | { variant: "Err", error: E }
    )
    & IntoIterator<T>;

export namespace Result {
    /**
     * Create an `Ok` variant of `Result`
     */
    export function Ok<T, E>(data: T): Result<T, E> {
        return {
            type: ResultSymbol,
            variant: "Ok",
            data,
            [IntoIteratorSymbol]: {
                into_iter(): Iterator<T> {
                    return ConstIterator.create([data]);
                }
            }
        };
    }

    /**
     * Create an `Err` variant of `Result`
     */
    export function Err<T, E>(error: E): Result<T, E> {
        return {
            type: ResultSymbol,
            variant: "Err",
            error,
            [IntoIteratorSymbol]: {
                into_iter(): Iterator<T> {
                    return ConstIterator.create([]);
                }
            }
        };
    }

    /**
     * @returns Whether `maybeResult` is a `Result`
     */
    export function isResult(maybeResult: unknown)
    : maybeResult is Result<unknown, unknown> {
        return (
            isObject(maybeResult)
            && hasProperty(maybeResult, "type")
            && maybeResult.type === ResultSymbol
        );
    }

    /**
     * @returns Whether `result` is an `Ok` variant of `Result`
     * @see Result.Ok
     */
    export function isOk<T, E>(result: Result<T, E>)
    : result is Result<T, E> & { variant: "Ok" } {
        return result.variant === "Ok";
    }

    /**
     * @returns Whether `result` is an `Err` variant of `Result`
     * @see Result.Err
     */
    export function isErr<T, E>(result: Result<T, E>)
    : result is Result<T, E> & { variant: "Err" } {
        return result.variant === "Err";
    }

    /**
     * Map a `Result` on one type of successful data to a Result on another
     * by applying a function to the inner data if it's an `Ok` variant.
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
     * Result.map(Result.Err<number, string>(false), n => n.toFixed(2));
     */
    export function map<T, E, U>(result: Result<T, E>, fn: (arg: T) => U)
    : Result<U, E> {
        if (Result.isOk(result)) {
            return Result.Ok(fn(result.data));
        }

        return Result.Err(result.error);
    }
}