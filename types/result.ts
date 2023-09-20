import {hasProperty, isObject} from "./utils.ts";
import {ConstIterator} from "./const_iterator.ts";
import {
    type IntoIterator,
    IntoIteratorSymbol
} from "../traits/into_iterator.ts";
import type {Iterator} from "../traits/iterator.ts";

export const ResultSymbol = Symbol("Result");

export type Result<T, E> =
    & { type: symbol }
    & (
        | { variant: "Ok", data: T }
        | { variant: "Err", error: E }
    )
    & IntoIterator<T>;

export namespace Result {
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

    export function isResult(maybeResult: unknown)
    : maybeResult is Result<unknown, unknown> {
        return (
            isObject(maybeResult)
            && hasProperty(maybeResult, "type")
            && maybeResult.type === ResultSymbol
        );
    }

    export function isOk<T, E>(result: Result<T, E>)
    : result is Result<T, E> & { variant: "Ok" } {
        return result.variant === "Ok";
    }

    export function isErr<T, E>(result: Result<T, E>)
    : result is Result<T, E> & { variant: "Err" } {
        return result.variant === "Err";
    }

    export function map<T, E, U>(result: Result<T, E>, fn: (arg: T) => U)
    : Result<U, E> {
        if (Result.isOk(result)) {
            return Result.Ok(fn(result.data));
        }

        return Result.Err(result.error);
    }
}