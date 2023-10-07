import { Option } from "../../types/option.ts";
import { assertEquals, assertInstanceOf } from "../../deps.ts";
import { Err, Ok } from "../../types/result.ts";

Deno.test("Option<T>.prototype.okOrElse", async (t) => {
  await t.step("Some(value), fn => Ok(value)", () => {
    const value = "Hello";
    const fn = () => -1;
    const result = Option.Some(value).okOrElse(fn);

    assertInstanceOf(result, Ok<string, number>);
    assertEquals(result.unwrap(), value);
  });

  await t.step("None, fn => Err(fn())", () => {
    const fn = () => -1;
    const result = Option.None<string>().okOrElse(fn);

    assertInstanceOf(result, Err<string, number>);
    assertEquals(result.unwrapErr(), fn());
  });
});
