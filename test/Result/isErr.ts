import {
    assertEquals,
} from "../../deps.ts";
import {Result} from "../../types/result.ts";

Deno.test("Result<T, E>", async (t) => {
    await t.step(
        "Ok(_) => false",
        () => assertEquals(Result.Ok("Hello").isErr(), false),
    );

    await t.step(
        "Err(_) => true",
        () => assertEquals(Result.Err("Error").isErr(), true),
    );
});