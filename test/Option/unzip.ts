import {None, Option, Some} from "../../types/option.ts";
import {assertEquals, assertInstanceOf} from "../../deps.ts";

Deno.test("Option<[U, V]>.prototype.unzip", async (t) => {
    await t.step(
        "Some([value, otherValue]) => [Some(value), Some(otherValue)]",
        () => {
            const value = "Hello";
            const otherValue = "World";
            const result = Option.Some<[string, string]>([value, otherValue])
                .unzip();

            assertEquals(Array.isArray(result), true);
            assertEquals(result.length, 2);

            const first = result[0];

            assertInstanceOf(first, Some<string>);
            assertEquals(first.unwrap(), value);

            const second = result[1];

            assertInstanceOf(second, Some<string>);
            assertEquals(second.unwrap(), otherValue);
        },
    );

    await t.step(
        "None => [None, None]",
        () => {
            const result = Option.None<[string, string]>().unzip();

            assertEquals(Array.isArray(result), true);
            assertEquals(result.length, 2);

            const first = result[0];

            assertInstanceOf(first, None<string>);

            const second = result[1];

            assertInstanceOf(second, None<string>);
        },
    );
});