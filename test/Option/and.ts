import {None, Option, Some} from "../../types/option.ts";
import {assertEquals, assertInstanceOf} from "../../deps.ts";

Deno.test("Option<T>.prototype.and", async (t) => {
    await t.step(
        "Some(value), Some(otherValue) => Some(otherValue)",
        () => {
            const value = "Hello";
            const otherValue = "World";
            const result = Option.Some(value).and(Option.Some(otherValue));

            assertInstanceOf(result, Some<string>);
            assertEquals(result.unwrap(), otherValue);
        },
    );

    await t.step(
        "Some(value), None => None",
        () => {
            const value = "Hello";
            const result = Option.Some(value).and(Option.None());

            assertInstanceOf(result, None<string>);
        },
    );

    await t.step(
        "None, Some(otherValue) => None",
        () => {
            const otherValue = "Hello";
            const result = Option.None().and(Option.Some(otherValue));

            assertInstanceOf(result, None<string>);
        },
    );

    await t.step(
        "None, None => None",
        () => {
            const result = Option.None().and(Option.None());

            assertInstanceOf(result, None<string>);
        },
    );
});