import { None, Option, Some } from "../../types/option.ts";
import { assertEquals, assertInstanceOf } from "../../deps.ts";

Deno.test("Option<T>.prototype.map", async (t) => {
  await t.step("Some(value) => Some(func(value))", () => {
    const value = "Hello";
    const func = (s: string) => s.length;
    const result = Option.Some(value).map(func);

    assertInstanceOf(result, Some<number>);
    assertEquals(result.unwrap(), func(value));
  });

  await t.step("None => None", () => {
    const func = (s: string) => s.length;
    const result = Option.None<string>().map(func);

    assertInstanceOf(result, None<number>);
  });
});
