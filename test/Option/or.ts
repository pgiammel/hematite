import {None, Option, Some} from "../../types/option.ts";
import {assertEquals, assertInstanceOf} from "../../deps.ts";

Deno.test("Option<T>.prototype.or", async (t) => {
    await t.step(
        "Some(value), Some(otherValue) => Some(value)",
        () => {
            const value = "Hello";
            const otherValue = "World";
            const result = Option.Some(value).or(Option.Some(otherValue));

            assertInstanceOf(result, Some<string>);
            assertEquals(result.unwrap(), value);
        },
    );

    await t.step(
        "Some(value), None => Some(value)",
        () => {
            const value = "Hello";
            const result = Option.Some(value).or(Option.None());

            assertInstanceOf(result, Some<string>);
            assertEquals(result.unwrap(), value);
        },
    );

    await t.step(
        "None, Some(otherValue) => Some(otherValue)",
        () => {
            const otherValue = "World";
            const result = Option.None<string>().or(Option.Some(otherValue));

            assertInstanceOf(result, Some<string>);
            assertEquals(result.unwrap(), otherValue);
        },
    );

    await t.step("None, None => None", () => {
        const result = Option.None().or(Option.None());

        assertInstanceOf(result, None);
    });
});