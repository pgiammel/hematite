import {assertEquals} from "../../deps.ts";
import { Option } from "../../types/option.ts";

Deno.test("Option<T>.prototype.unwrapOr", async (t) => {
    await t.step("Some(value), defaultValue => value", () => {
        const value = "Hello";

        assertEquals(Option.Some(value).unwrapOr("Fail"), value);
    });

    await t.step("None, defaultValue => defaultValue", () => {
        const defaultValue = "Hello";

        assertEquals(Option.None().unwrapOr(defaultValue), defaultValue);
    });
});