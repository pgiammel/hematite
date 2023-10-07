import { None, Option, Some } from "../../types/option.ts";
import { assertEquals, assertInstanceOf } from "../../deps.ts";

Deno.test("Option<T>.prototype.xor", async (t) => {
  await t.step(
    "Some(value), None => Some(value)",
    () => {
      const value = "Hello";
      const result = Option.Some(value).xor(Option.None());

      assertInstanceOf(result, Some<string>);
      assertEquals(result.unwrap(), value);
    },
  );

  await t.step(
    "None, Some(otherValue) => Some(otherValue)",
    () => {
      const otherValue = "World";
      const result = Option.None<string>().xor(Option.Some(otherValue));

      assertInstanceOf(result, Some<string>);
      assertEquals(result.unwrap(), otherValue);
    },
  );

  await t.step(
    "Some(value), Some(otherValue) => None",
    () => {
      const value = "Hello";
      const otherValue = "World";
      const result = Option.Some(value).xor(Option.Some(otherValue));

      assertInstanceOf(result, None<string>);
    },
  );

  await t.step("None, None => None", () => {
    const result = Option.None().xor(Option.None());

    assertInstanceOf(result, None);
  });
});
