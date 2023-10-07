import {None, Option, Some} from "../../types/option.ts";
import {assertEquals, assertInstanceOf} from "../../deps.ts";

Deno.test("Option<T>.prototype.filter", async (t) => {
    await t.step("Some(value), fn <true> => Some(value)", () => {
        const value = "Hello";
        const func = (_s: string): boolean => true;
        const result = Option.Some(value).filter(func);

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), value);
    });

    await t.step("Some(value), fn <false> => None", () => {
        const value = "Hello";
        const func = (_s: string): boolean => false;
        const result = Option.Some(value).filter(func);

        assertInstanceOf(result, None<string>);
    });

    await t.step("None, fn <true> => None", () => {
        const func = (_: unknown): boolean => true;
        const result = Option.None().filter(func);

        assertInstanceOf(result, None);
    });

    await t.step("None, fn <false> => None", () => {
        const func = (_: unknown): boolean => false;
        const result = Option.None().filter(func);

        assertInstanceOf(result, None);
    });
});