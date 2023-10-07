import { None, Option, Some } from "../../types/option.ts";
import { assertEquals, assertInstanceOf } from "../../deps.ts";

Deno.test("Option<Option<U>>.prototype.flatten", async (t) => {
  await t.step("Some(Some(value)) => Some(value)", () => {
    const value = "Hello";
    const result = Option.Some(Option.Some(value)).flatten();

    assertInstanceOf(result, Some<string>);
    assertEquals(result.unwrap(), value);
  });

  await t.step("Some(None) => None", () => {
    const result = Option.Some(Option.None()).flatten();

    assertInstanceOf(result, None);
  });

  await t.step("None => None", () => {
    const result = Option.None<Option<unknown>>().flatten();

    assertInstanceOf(result, None);
  });
});
