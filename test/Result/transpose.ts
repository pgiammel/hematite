import { assertEquals, assertInstanceOf } from "../../deps.ts";
import { Err, Ok, Result } from "../../types/result.ts";
import { None, Option, Some } from "../../types/option.ts";

Deno.test("Result<Option<T>, E>.prototype.transpose", async (t) => {
  await t.step("Ok(Some(value)) => Some(Ok(value))", () => {
    const value = "Hello";
    const result = Result.Ok(Option.Some(value)).transpose();

    assertInstanceOf(result, Some<Result<string, unknown>>);

    const inner = result.unwrap();

    assertInstanceOf(inner, Ok<string, unknown>);
    assertEquals(inner.unwrap(), value);
  });

  await t.step("Ok(None) => None", () => {
    const result = Result.Ok(Option.None()).transpose();

    assertInstanceOf(result, None<unknown>);
  });

  await t.step("Err(error) => Some(Err(error))", () => {
    const error = -1;
    const result = Result.Err<Option<unknown>, number>(-1).transpose();

    assertInstanceOf(result, Some<Result<unknown, number>>);

    const inner = result.unwrap();

    assertInstanceOf(inner, Err<unknown, number>);
    assertEquals(inner.unwrapErr(), error);
  });
});
