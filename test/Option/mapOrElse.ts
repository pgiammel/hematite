import {Option} from "../../types/option.ts";
import {assertEquals} from "../../deps.ts";

Deno.test("Option<T>.prototype.mapOrElse", async (t) => {
    await t.step("Some(value) => mapFunc(value)", () => {
        const value = "Hello";
        const mapFunc = (s: string) => s.length;
        const defaultFunc = () => 0;
        const result = Option.Some(value).mapOrElse(
            defaultFunc,
            mapFunc,
        );

        assertEquals(result, mapFunc(value));
    });

    await t.step("None => defaultFunc()", () => {
        const defaultFunc = () => 0;
        const mapFunc = (s: string) => s.length;
        const result = Option.None<string>().mapOrElse(
            defaultFunc,
            mapFunc,
        );

        assertEquals(result, defaultFunc());
    });
});