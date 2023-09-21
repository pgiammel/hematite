import {assertEquals, assertExists} from "../deps.ts";
import {Result} from "./result.ts";
import {Option} from "./option.ts";
import {IntoIteratorSymbol} from "../traits/into_iterator.ts";
import {IteratorSymbol} from "../traits/iterator.ts";

Deno.test("Result<T, E>", async (t) => {
    await t.step("isResult", async (t) => {
        await t.step("Result.Ok => true", () =>
            assertEquals(Result.isResult(Result.Ok("Hello")), true)
        );

        await t.step("Result.Err => true", () =>
            assertEquals(Result.isResult(Result.Err("Error")), true)
        );

        await t.step("string => false", () =>
            assertEquals(Result.isResult("Result"), false)
        );

        await t.step("number => false", () =>
            assertEquals(Result.isResult(5), false)
        );

        await t.step("boolean => false", () =>
            assertEquals(Result.isResult(true), false)
        );

        await t.step("Result<T, E>[] => false", () =>
            assertEquals(Result.isResult([Result.Ok(5)]), false)
        );

        await t.step("string[] => false", () =>
            assertEquals(Result.isResult(["Hello"]), false)
        );

        await t.step("{} => false", () =>
            assertEquals(Result.isResult({}), false)
        );

        await t.step("null => false", () =>
            assertEquals(Result.isResult(null), false)
        );

        await t.step("undefined => false", () =>
            assertEquals(Result.isResult(undefined), false)
        );
    });

    await t.step("isOk", async (t) => {
        await t.step("Result.Ok => true", () =>
            assertEquals(Result.isOk(Result.Ok("Hello")), true)
        );

        await t.step("Result.Err => false", () =>
            assertEquals(Result.isOk(Result.Err("Error")), false)
        );
    });

    await t.step("isErr", async (t) => {
        await t.step("Result.Ok => false", () =>
            assertEquals(Result.isErr(Result.Ok("Hello")), false)
        );

        await t.step("Result.Err => true", () =>
            assertEquals(Result.isErr(Result.Err("Error")), true)
        );
    });


    await t.step("map", async (t) => {
        await t.step("Result.Ok => Result.Ok", () => {
            const innerValue = "Hello";
            const func = (s: string) => s.length;
            const result = Result.map(Result.Ok(innerValue), func);

            assertEquals(Result.isResult(result), true);

            const isOk = Result.isOk(result);

            assertEquals(isOk, true);
            assertEquals(isOk && result.data, func(innerValue));
        })

        await t.step("Result.Err => Result.Err", () => {
            const error = "Error";
            const func = (s: string) => s.length;
            const result = Result.map(Result.Err<string, string>(error), func);

            assertEquals(Result.isResult(result), true);

            const isErr = Result.isErr(result);

            assertEquals(isErr, true);
            assertEquals(isErr && result.error, error);
        })
    });

    await t.step("IntoIterator trait", async (t) => {
        await t.step("into_iter", async (t) => {
            await t.step("Result.Ok(data) => Iterator over [data]", () => {
                const result = Result.Ok(5);
                const iter = result[IntoIteratorSymbol].into_iter();

                assertExists(iter[IteratorSymbol]);

                const firstItem = iter[IteratorSymbol].next();

                // rest is duplicate from option.test.ts
                // maybe check later if deduplication is needed
                assertEquals(Option.isOption(firstItem), true);

                const firstItemIsSome = Option.isSome(firstItem);

                assertEquals(firstItemIsSome, true);
                assertEquals(firstItemIsSome && firstItem.value, 5);

                const secondItem = iter[IteratorSymbol].next();

                assertEquals(Option.isOption(secondItem), true);
                assertEquals(Option.isNone(secondItem), true);
            });

            // check that it returns an iterator that will yield no items
            await t.step("Result.Err => Iterator over []", () => {
                const result = Result.Err("Error");
                const iter = result[IntoIteratorSymbol].into_iter();

                assertExists(iter[IteratorSymbol]);

                const item = iter[IteratorSymbol].next();

                assertEquals(Option.isOption(item), true);
                assertEquals(Option.isNone(item), true);
            })
        });
    });
});