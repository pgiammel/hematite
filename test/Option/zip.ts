import { None, Option, Some } from "../../types/option.ts";
import { assertEquals, assertInstanceOf } from "../../deps.ts";

Deno.test("Option<T>.prototype.zip", async (t) => {
  await t.step(
    "Some(value), Some(otherValue) => Some([value, otherValue])",
    () => {
      const value = "Hello";
      const otherValue = "World";
      const result = Option.Some(value).zip(Option.Some(otherValue));

      assertInstanceOf(result, Some<[string, string]>);
      assertEquals(result.unwrap(), [value, otherValue]);
    },
  );

  await t.step("Some(value), None => None", () => {
    const value = "Hello";
    const result = Option.Some(value).zip(Option.None());

    assertInstanceOf(result, None<[string, unknown]>);
  });

  await t.step("None, Some(otherValue) => None", () => {
    const otherValue = "World";
    const result = Option.None().zip(Option.Some(otherValue));

    assertInstanceOf(result, None<[unknown, string]>);
  });

  await t.step("None, None => None", () => {
    const result = Option.None().zip(Option.None());

    assertInstanceOf(result, None<[unknown, unknown]>);
  });
});
