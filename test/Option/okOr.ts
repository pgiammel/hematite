import { Option } from "../../types/option.ts";
import { assertEquals, assertInstanceOf } from "../../deps.ts";
import { Err, Ok } from "../../types/result.ts";

Deno.test("Option<T>.prototype.okOr", async (t) => {
  await t.step("Some(value), err => Ok(value)", () => {
    const value = "Hello";
    const err = -1;
    const result = Option.Some(value).okOr(err);

    assertInstanceOf(result, Ok<string, number>);
    assertEquals(result.unwrap(), value);
  });

  await t.step("None, err => Err(err)", () => {
    const err = -1;
    const result = Option.None<string>().okOr(err);

    assertInstanceOf(result, Err<string, number>);
    assertEquals(result.unwrapErr(), err);
  });
});
