import {
    assertInstanceOf,
    assertEquals,
} from "../../deps.ts";
import {Result} from "../../types/result.ts";
import {None, Some} from "../../types/option.ts";

Deno.test("Result<T, E>.prototype.err", async (t) => {
    await t.step("Ok(_) => None", () => {
        const result = Result.Ok("Hello").err();

        assertInstanceOf(result, None<unknown>);
    });

    await t.step("Err(error) => Some(error)", () => {
        const error = -1;
        const result = Result.Err(error).err();

        assertInstanceOf(result, Some<number>);
        assertEquals(result.unwrap(), error);
    });
});