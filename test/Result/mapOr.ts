import {
    assertEquals,
} from "../../deps.ts";
import {Result} from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.mapOr", async (t) => {
    await t.step("Ok(data), defaultValue, fn => fn(data)", () => {
        const data = "Hello";
        const func = (s: string): number => s.length;
        const result = Result.Ok(data).mapOr(-1, func);

        assertEquals(result, func(data));
    });

    await t.step("Err(_), defaultValue, fn => defaultValue", () => {
        const defaultValue = 5;
        const func = (s: string): number => s.length;
        const result = Result.Err<string, number>(-1).mapOr(defaultValue, func);

        assertEquals(result, defaultValue);
    });
});