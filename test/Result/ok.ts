import {
    assertInstanceOf,
    assertEquals,
} from "../../deps.ts";
import {Result} from "../../types/result.ts";
import {None, Some} from "../../types/option.ts";

Deno.test("Result<T, E>.prototype.ok", async (t) => {
    await t.step("Ok(data) => Some(data)", () => {
        const data = "Hello";
        const result = Result.Ok(data).ok();

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), data);
    });

    await t.step("Err(_) => None", () => {
        const result = Result.Err(-1).ok();

        assertInstanceOf(result, None<unknown>);
    });
});