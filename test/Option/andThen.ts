import {None, Option, Some} from "../../types/option.ts";
import {assertEquals, assertInstanceOf} from "../../deps.ts";

Deno.test("Option<T>.prototype.andThen", async (t) => {
    await t.step("Some(value) => func(value) <Some>", () => {
        const value = "Hello";
        const func = (s: string) => Option.Some(s.length);
        const result = Option.Some(value).andThen(func);
        const expected = func(value);

        assertInstanceOf(expected, Some<number>);
        assertInstanceOf(result, Some<number>);

        assertEquals(result.unwrap(), expected.unwrap());
    });

    await t.step("Some(value) => func(value) <None>", () => {
        const value = "Hello";
        const func = (_s: string) => Option.None<number>();
        const result = Option.Some(value).andThen(func);
        const expected = func(value);

        assertInstanceOf(expected, None<number>);
        assertInstanceOf(result, None<number>);
    });

    await t.step(
        "Option.None, func(value) <Some> => None",
        () => {
            const func = (s: string) => Option.Some<number>(s.length);
            const result = Option.None<string>().andThen(func);

            assertInstanceOf(result, None<number>);
        },
    );

    await t.step(
        "None, func(value) <None> => None",
        () => {
            const func = (_s: string) => Option.None<number>();
            const result = Option.None<string>().andThen(func);

            assertInstanceOf(result, None<number>);
        },
    );
});