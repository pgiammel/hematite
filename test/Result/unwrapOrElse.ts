import {
    assertEquals,
} from "../../deps.ts";
import {Result} from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.unwrapOrElse", async (t) => {
    await t.step("Ok(data), defaultFn => data", () => {
        const data = "Hello";
        const func = (_: unknown) => "World";
        const result = Result.Ok(data).unwrapOrElse(func);

        assertEquals(result, data);
    });

    await t.step("Err(_), defaultData => defaultData", () => {
        const error = -1;
        const func = (_: unknown) => "World";
        const result = Result.Err<string, number>(error).unwrapOrElse(func);

        assertEquals(result, func(error));
    });
});