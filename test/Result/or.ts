import {
    assertInstanceOf,
    assertEquals,
} from "../../deps.ts";
import {Err, Ok, Result} from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.or", async (t) => {
    await t.step("Ok(data), Ok(otherData) => Ok(data)", () => {
        const data = "Hello";
        const result = Result.Ok(data).or(Result.Ok("World"));

        assertInstanceOf(result, Ok<string, unknown>);
        assertEquals(result.unwrap(), data);
    });

    await t.step("Ok(data), Err(otherError) => Ok(data)", () => {
        const data = "Hello";
        const result = Result.Ok(data).or(Result.Err(-1));

        assertInstanceOf(result, Ok<string, unknown>);
        assertEquals(result.unwrap(), data);
    });

    await t.step("Err(error), Ok(otherData) => Ok(otherData)", () => {
        const otherData = "World";
        const result = Result.Err(-1).or(Result.Ok(otherData));

        assertInstanceOf(result, Ok<unknown, number>);
        assertEquals(result.unwrap(), otherData);
    });

    await t.step("Err(error), Err(otherError) => Err(error)", () => {
        const otherError = -2;
        const result = Result.Err(-1).or(Result.Err(otherError));

        assertInstanceOf(result, Err<unknown, number>);
        assertEquals(result.unwrapErr(), otherError);
    });
});