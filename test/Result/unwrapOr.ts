import {
    assertEquals,
} from "../../deps.ts";
import {Result} from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.unwrapOr", async (t) => {
    await t.step("Ok(data), defaultData => data", () => {
        const data = "Hello";
        const result = Result.Ok(data).unwrapOr("World");

        assertEquals(result, data);
    });

    await t.step("Err(_), defaultData => defaultData", () => {
        const defaultData = "World";
        const result = Result.Err<string, number>(-1).unwrapOr(defaultData);

        assertEquals(result, defaultData);
    });
});