import {assertEquals} from "../deps.ts";
import {Option} from "./option.ts";

Deno.test("Option<T>", async (t) => {
    await t.step("isOption", async (t) => {
        await t.step("Option.Some => true", () =>
            assertEquals(Option.isOption(Option.Some("Hello")), true)
        );

        await t.step("Option.None => true", () =>
            assertEquals(Option.isOption(Option.None()), true)
        );

        await t.step("string => false", () =>
            assertEquals(Option.isOption("Option"), false)
        );

        await t.step("number => false", () =>
            assertEquals(Option.isOption(5), false)
        );

        await t.step("boolean => false", () =>
            assertEquals(Option.isOption(true), false)
        );

        await t.step("Option<T>[] => false", () =>
            assertEquals(Option.isOption([Option.None()]), false)
        );

        await t.step("string[] => false", () =>
            assertEquals(Option.isOption(["Hello"]), false)
        );

        await t.step("{} => false", () =>
            assertEquals(Option.isOption({}), false)
        );

        await t.step("null => false", () =>
            assertEquals(Option.isOption(null), false)
        );

        await t.step("undefined => false", () =>
            assertEquals(Option.isOption(undefined), false)
        );
    });

    await t.step("isSome", async (t) => {
        await t.step("Option.Some => true", () =>
            assertEquals(Option.isSome(Option.Some("Hello")), true)
        )

        await t.step("Option.None => false", () =>
            assertEquals(Option.isSome(Option.None()), false)
        )
    });

    await t.step("isNone", async (t) => {
        await t.step("Option.Some => false", () =>
            assertEquals(Option.isNone(Option.Some("Hello")), false)
        )

        await t.step("Option.None => true", () =>
            assertEquals(Option.isNone(Option.None()), true)
        )
    });

    await t.step("map", async (t) => {
        await t.step("Option.Some => Option.Some", () => {
            const innerValue = "Hello";
            const func = (s: string) => s.length;
            const result = Option.map(Option.Some(innerValue), func);

            assertEquals(Option.isOption(result), true);

            const isSome = Option.isSome(result);

            assertEquals(isSome, true);
            assertEquals(isSome && result.value, func(innerValue));
        })

        await t.step("Option.None => Option.None", () => {
            const func = (s: string) => s.length;
            const result = Option.map(Option.None<string>(), func);

            assertEquals(Option.isOption(result), true);
            assertEquals(Option.isNone(result), true);
        })
    });
});