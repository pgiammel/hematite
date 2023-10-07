import {
    assertInstanceOf,
    assertEquals,
} from "../../deps.ts";
import {Err, Ok, Result} from "../../types/result.ts";

Deno.test("Result<Result<U, E>, E>.prototype.flatten", async (t) => {
    await t.step("Ok(Ok(data)) => Ok(data)", () => {
        const data = "Hello";
        const result = Result.Ok(Result.Ok(data)).flatten();

        assertInstanceOf(result, Ok<string, unknown>);
        assertEquals(result.unwrap(), data);
    });

    await t.step("Ok(Err(innerError)) => Err(innerError)", () => {
        const innerError = -1;
        const result = Result.Ok(Result.Err(innerError)).flatten();

        assertInstanceOf(result, Err<unknown, number>);
        assertEquals(result.unwrapErr(), innerError);
    });

    await t.step("Err(error) => Err(error)", () => {
        const error = -1;
        const result = Result.Err<Result<unknown, number>, number>(error)
            .flatten();

        assertInstanceOf(result, Err<unknown, number>);
        assertEquals(result.unwrapErr(), error);
    });
});