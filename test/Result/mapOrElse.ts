import {
    assertEquals,
} from "../../deps.ts";
import {Result} from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.mapOrElse", async (t) => {
    await t.step("Ok(data), defaultFn, mapFn => mapFn(data)", () => {
        const data = "Hello";
        const defaultFn = (_: unknown) => -1;
        const mapFn = (s: string) => s.length;
        const result = Result.Ok(data).mapOrElse(defaultFn, mapFn);

        assertEquals(result, mapFn(data));
    });

    await t.step("Err(error), defaultFn, mapFn => defaultFn(error)", () => {
        const error = true;
        const defaultFn = (err: boolean) => Number(err);
        const mapFn = (s: string) => s.length;
        const result = Result.Err<string, boolean>(error).mapOrElse(
            defaultFn,
            mapFn,
        );

        assertEquals(result, defaultFn(error));
    });
});