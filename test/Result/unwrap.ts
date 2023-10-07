import {assertEquals, assertThrows} from "../../deps.ts";
import {Result} from "../../types/result.ts";
import {UnwrapError} from "../../types/error.ts";

Deno.test("Result<T, E>.prototype.unwrap", async (t) => {
    await t.step("Ok(data) => data", () => {
        const data = "Hello";

        assertEquals(Result.Ok(data).unwrap(), data);
    });

    await t.step("Err(err) => throws UnwrapError", () => {
        assertThrows(
            () => Result.Err("Fail").unwrap(),
            UnwrapError,
        );
    });
});