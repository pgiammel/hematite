import {assertEquals} from "../../deps.ts";
import {Option} from "../../types/option.ts";

Deno.test("Option<T>.prototype.isNone", async (t) => {
    await t.step(
        "Some(_) => false",
        () => assertEquals(Option.Some("Hello").isNone(), false),
    );

    await t.step(
        "None => true",
        () => assertEquals(Option.None().isNone(), true),
    );
});