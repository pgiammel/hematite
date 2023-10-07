import {Err, Ok, Result} from "../../types/result.ts";
import {
    assertInstanceOf,
    assertEquals,
} from "../../deps.ts";

Deno.test("Result<T, E>.prototype.andThen", async (t) => {
    await t.step("Ok(data), fn <Ok(otherData)> => Ok(otherData)", () => {
        const data = "Hello";
        const func = (s: string) => Result.Ok(s.length);
        const result = Result.Ok(data).andThen(func);
        const expected = func(data);

        assertInstanceOf(expected, Ok<number, unknown>);
        assertInstanceOf(result, Ok<number, unknown>);
        assertEquals(result.unwrap(), expected.unwrap());
    });

    await t.step("Ok(data), fn <Err(otherError)> => Err(otherError)", () => {
        const data = "Hello";
        const func = (_: string) => Result.Err(-1);
        const result = Result.Ok<string, number>(data).andThen(func);
        const expected = func(data);

        assertInstanceOf(expected, Err<unknown, number>);
        assertInstanceOf(result, Err<unknown, number>);
        assertEquals(result.unwrapErr(), expected.unwrapErr());
    });

    await t.step("Err(error), fn <Ok(otherData)> => Err(error)", () => {
        const error = false;
        const func = (s: string) => Result.Ok<number, boolean>(s.length);
        const result = Result.Err<string, boolean>(error).andThen(func);

        assertInstanceOf(result, Err<number, boolean>);
        assertEquals(result.unwrapErr(), error);
    });

    await t.step("Err(error), fn <Err(otherError)> => Err(error)", () => {
        const error = false;
        const func = (_: string) => Result.Err<number, boolean>(true);
        const result = Result.Err<string, boolean>(error).andThen(func);

        assertInstanceOf(result, Err<unknown, boolean>);
        assertEquals(result.unwrapErr(), error);
    });
});