import { Option } from "../../types/option.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("Option<T>.prototype.unwrapOrElse", async (t) => {
  await t.step("Some(value), fn => value", () => {
    const value = "Hello";
    const func = () => "World";
    const result = Option.Some(value).unwrapOrElse(func);

    assertEquals(result, value);
  });

  await t.step("Option.None, fn => fn()", () => {
    const func = () => "World";
    const result = Option.None().unwrapOrElse(func);

    assertEquals(result, func());
  });
});
