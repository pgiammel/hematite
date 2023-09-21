import {assertEquals, assertExists} from "../deps.ts";
import {Option} from "./option.ts";
import {IntoIteratorSymbol} from "../traits/into_iterator.ts";
import {IteratorSymbol} from "../traits/iterator.ts";

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

    await t.step("IntoIterator trait", async (t) => {
        await t.step("into_iter", async (t) => {
            await t.step("Option.Some(value) => Iterator over [value]", () => {
                const option = Option.Some(5);
                const iter = option[IntoIteratorSymbol].into_iter();

                assertExists(iter[IteratorSymbol]);

                const firstItem = iter[IteratorSymbol].next();

                assertEquals(Option.isOption(firstItem), true);

                const firstItemIsSome = Option.isSome(firstItem);

                assertEquals(firstItemIsSome, true);
                assertEquals(firstItemIsSome && firstItem.value, 5);

                const secondItem = iter[IteratorSymbol].next();

                assertEquals(Option.isOption(secondItem), true);
                assertEquals(Option.isNone(secondItem), true);
            });

            // check that it returns an iterator that will yield no items
            await t.step("Option.None => Iterator over []", () => {
                const option = Option.None<number>();
                const iter = option[IntoIteratorSymbol].into_iter();

                assertExists(iter[IteratorSymbol]);

                const item = iter[IteratorSymbol].next();

                assertEquals(Option.isOption(item), true);
                assertEquals(Option.isNone(item), true);
            })
        });
    });
});