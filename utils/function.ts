import type { Drop, First, Reverse } from "./tuple.ts";

type _Curry<
  F extends (...params: any[]) => any,
  I extends any[] = [],
  OF extends (...params: any[]) => any = F,
> = Parameters<F>["length"] extends 0 ? ReturnType<OF>
  : (param: First<Parameters<F>>) => Curry<
    (...params: Drop<Parameters<F>, 1>) => ReturnType<OF>,
    [First<Parameters<F>>, ...I],
    OF
  >;

/**
 * Type of Function after currying it, i.e. making it accept each parameter in
 * successive calls instead of all at once
 *
 * @example
 * // (x: number) => ((y: string) => boolean)
 * // number => string => boolean
 * Curry<(x: number, y: string) => boolean>
 */
export type Curry<
  F extends (...params: any[]) => any,
  I extends any[] = [],
  OF extends (...params: any[]) => any = F,
> = _Curry<F>;

/**
 * Type of Function after reversing its parameters
 *
 * @example
 * // (y: string, x: number) => boolean
 * Flip<(x: number, y: string) => boolean>
 */
export type Flip<F extends (...params: any[]) => any> = (
  ...params: Reverse<Parameters<F>>
) => ReturnType<F>;

/**
 * Make a function accept each parameter in successive calls instead of all at
 * once. Currying a function that accepts no parameter is **undefined
 * behaviour**.
 *
 * @param func Function to curry
 * @returns Curried function
 *
 * @example
 * // 5
 * curry((x: number, y: number) => x + y)(2)(3);
 */
export function curry<F extends (...args: any[]) => any>(func: F): Curry<F> {
  // Implementation not typed...
  // Based on:
  // https://javascript.info/currying-partials#advanced-curry-implementation
  // Does more than wanted
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function partially_curried(this: any, ...args2: any[]) {
        return curried.apply(this, args.concat(args2));
      };
    }
  } as any;
}

/**
 * Make a function accept each parameter in reverse order
 *
 * @param func Function to flip
 * @returns Flipped function
 *
 * @example
 * // ["Hello", 5]
 * flip((num: number, str: string) => [num, str])(5, "Hello");
 */
export function flip<F extends (...args: any[]) => any>(func: F): Flip<F> {
  // Implementation not typed...
  const flipped = function (this: any, ...args: any[]) {
    return func.apply(this, args.toReversed());
  };

  Object.defineProperty(flipped, "length", { value: func.length });
  return flipped;
}

type _IsChaining<
  Funcs extends ((param: any) => any)[],
  PreviousFunc extends ((param: any) => any) | null = null,
> = Funcs["length"] extends 0 ? PreviousFunc extends null ? false
  : true
  : Funcs extends [infer First, ...infer Rest]
    ? First extends (param: infer Param) => any
      ? Rest extends ((param: any) => any)[]
        ? PreviousFunc extends null ? _IsChaining<Rest, First>
        : ReturnType<
          NonNullable<PreviousFunc>
        > extends Param ? _IsChaining<Rest, First>
        : false
      : false
    : false
  : false;

/**
 * Type true or false whether functions in a list have chaining return values
 * and parameters.
 * The result of one function must be the first parameter of the next function.
 *
 * @see Combine
 *
 * @example
 * // true
 * IsChaining<[
 *   (param: number) => string,
 *   (param: string) => boolean,
 * ]>
 *
 * @example
 * // true
 * IsChaining<[(param: number) => string]>
 *
 * @example
 * // false
 * IsChaining<[]>
 *
 * @example
 * // false
 * IsChaining<[
 *   (param: number) => string,
 *   (param: boolean) => number,
 * ]>
 */
export type IsChaining<
  Funcs extends ((param: any) => any)[],
> = _IsChaining<Funcs>;

/**
 * Type of a function that accepts the same first parameter as the first
 * function in a list and returns the same return value as the last one.
 * The function list must be chaining.
 *
 * @see IsChaining
 *
 * @example
 * // (param: string) => boolean
 * Combine<[
 *   (param: string) => number,
 *   (param: number) => boolean,
 * ]>
 *
 * @example
 * // (param: string) => number
 * Combine<[(param: string) => number]>
 *
 * @example
 * // never
 * Combine<[]>
 *
 * @example
 * // never
 * Combine<[
 *   (param: string) => number,
 *   (param: boolean) => string,
 * ]>
 */
export type Combine<Funcs extends ((param: any) => any)[]> =
  IsChaining<Funcs> extends true
    ? Funcs extends [infer First, ...infer Rest]
      ? Funcs extends [...infer Rest2, infer Last]
        ? First extends (param: infer Param) => any
          ? Last extends (param: any) => infer Return ? (param: Param) => Return
          : never
        : never
      : never
    : never
    : never;

/**
 * Combine every function of a list into a single one by calling each function
 * with the return value of the previous one as parameter.
 * Combining no functions is **undefined behaviour**.
 *
 * @param funcs Functions to combine
 * @returns New combined function
 *
 * @example
 * // 12.00
 * combine(
 *   (param: number): number => param * 2,
 *   (param: number): string => param.toFixed(2),
 * )(6);
 */
export function combine<F extends ((param: any) => any)[]>(
  ...funcs: F
): Combine<F> {
  // Implementation not typed...
  return function (param: any): any {
    let returnValue: any = param;

    for (const func of funcs) {
      returnValue = func(returnValue);
    }

    return returnValue;
  } as Combine<F>;
}
