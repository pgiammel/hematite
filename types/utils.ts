/**
 * @param maybeObject Object to check
 * @returns Whether `maybeObject` is considered an Object or not, excluding
 * Array and null
 */
export function isObject(maybeObject: unknown): maybeObject is Object {
    return (
        typeof maybeObject === "object"
        && !Array.isArray(maybeObject)
        && maybeObject !== null
    );
}

/**
 * @param object Object to check
 * @param property Property to look for
 * @returns Whether `object` has the `property`
 */
export function hasProperty
<T extends Object, U extends PropertyKey>
(object: T, property: U)
: object is T & Record<U, unknown> {
    return Object.prototype.hasOwnProperty.call(object, property);
}