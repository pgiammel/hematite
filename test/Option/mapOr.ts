import { Option } from "../../types/option.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("Option<T>.prototype.mapOr", async (t) => {
  await t.step("Some(value) => func(value)", () => {
    const value = "Hello";
    const func = (s: string) => s.length;
    const result = Option.Some(value).mapOr(0, func);

    assertEquals(result, func(value));
  });

  await t.step("None => defaultValue", () => {
    const defaultValue = 0;
    const func = (s: string) => s.length;
    const result = Option.None<string>().mapOr(defaultValue, func);

    assertEquals(result, defaultValue);
  });
});
