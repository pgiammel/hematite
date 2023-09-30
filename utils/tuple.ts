/**
 * Type of the First element of Tuple
 *
 * @example
 * // 1
 * First<[1, 2, 3]>
 *
 * @example
 * // never
 * First<[]>
 */
export type First<Tuple extends any[]> = Tuple extends
  [infer First, ...infer Rest] ? First : never;

/**
 * Type of the Last element of Tuple
 *
 * @example
 * // 3
 * Last<[1, 2, 3]>
 *
 * @example
 * // never
 * Last<[]>
 */
export type Last<Tuple extends any[]> = Tuple extends
  [...infer Rest, infer Last] ? Last : never;

type _Drop<
  Tuple extends any[],
  Count extends number,
  Dropped extends any[] = [],
> = Dropped["length"] extends Count ? Tuple
  : Tuple extends [infer First, ...infer Rest]
    ? _Drop<Rest, Count, [...Dropped, First]>
  : never;

/**
 * Type of Tuple after Dropping a Count of elements. `never` if dropping more
 * elements than the tuple has.
 *
 * @example
 * // [3, 4]
 * Drop<[1, 2, 3, 4], 2>
 *
 * @example
 * // never
 * Drop<[1], 2>
 */
export type Drop<Tuple extends any[], Count extends number> = _Drop<
  Tuple,
  Count
>;

type _Reverse<Tuple extends any[], Reversed extends any[] = []> =
  Tuple["length"] extends 0 ? Reversed
    : Tuple extends [infer First, ...infer Rest]
      ? _Reverse<Rest, [First, ...Reversed]>
    : never;

/**
 * Type of Tuple after Reversing its elements
 *
 * @example
 * // [3, 2, 1]
 * Reverse<[1, 2, 3]>
 */
export type Reverse<Tuple extends any[]> = _Reverse<Tuple>;

/**
 * Assert that T is a 2-Tuple and infer its type
 *
 * @example
 * // ["Hello", 5]
 * TwoTuple<["Hello", 5]>
 *
 * @example
 * // never
 * TwoTuple<"World">
 */
export type TwoTuple<T> = T extends [infer First, infer Second]
  ? [First, Second]
  : never;
