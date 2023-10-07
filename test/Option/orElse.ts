import {None, Option, Some} from "../../types/option.ts";
import {assertEquals, assertInstanceOf} from "../../deps.ts";

Deno.test("Option<T>.prototype.orElse", async (t) => {
    await t.step("Some(value), func <Some(otherValue)> => Some(value)", () => {
        const value = "Hello";
        const otherValue = "World";
        const func = () => Option.Some(otherValue);
        const result = Option.Some(value).orElse(func);

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), value);
    });

    await t.step("None, func <Some(otherValue)> => func()", () => {
        const otherValue = "World";
        const func = () => Option.Some(otherValue);
        const result = Option.None<string>().orElse(func);

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), otherValue);
    });

    await t.step("None, func <None> => func()", () => {
        const func = () => Option.None<string>();
        const result = Option.None<string>().orElse(func);

        assertInstanceOf(result, None);
    });
});