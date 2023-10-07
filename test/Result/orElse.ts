import {
    assertInstanceOf,
    assertEquals,
} from "../../deps.ts";
import {Err, Ok, Result} from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.orElse", async (t) => {
    await t.step("Ok(data), fn <Ok> => Ok(data)", () => {
        const data = "Hello";
        const func = (_: unknown) => Result.Ok("World");
        const result = Result.Ok(data).orElse(func);

        assertInstanceOf(result, Ok<string, unknown>);
        assertEquals(result.unwrap(), data);
    });

    await t.step("Ok(data), fn <Err> => Ok(data)", () => {
        const data = "Hello";
        const func = (_: unknown) => Result.Err<string, number>(-2);
        const result = Result.Ok(data).orElse(func);

        assertInstanceOf(result, Ok<string, number>);
        assertEquals(result.unwrap(), data);
    });

    await t.step("Err(error), fn <Ok> => fn()", () => {
        const error = -1;
        const func = (_: unknown) => Result.Ok("World");
        const result = Result.Err<string, number>(error).orElse(func);
        const expected = func(error);

        assertInstanceOf(expected, Ok<string, unknown>);
        assertInstanceOf(result, Ok<string, number>);
        assertEquals(result.unwrap(), expected.unwrap());
    });

    await t.step("Err(error), fn <Err> => fn()", () => {
        const error = -1;
        const func = (_: unknown) => Result.Err(-2);
        const result = Result.Err(error).orElse(func);
        const expected = func(error);

        assertInstanceOf(expected, Err<unknown, number>);
        assertInstanceOf(result, Err<unknown, number>);
        assertEquals(result.unwrapErr(), expected.unwrapErr());
    });
});