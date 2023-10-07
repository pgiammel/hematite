import { assertEquals, assertThrows } from "../../deps.ts";
import { Option } from "../../types/option.ts";
import { UnwrapError } from "../../types/error.ts";

Deno.test("Option<T>.prototype.unwrap", async (t) => {
  await t.step("Some(value) => value", () => {
    const value = "Hello";

    assertEquals(Option.Some(value).unwrap(), value);
  });

  await t.step("None => throws UnwrapError", () => {
    assertThrows(
      () => Option.None().unwrap(),
      UnwrapError,
    );
  });
});
