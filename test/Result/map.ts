import { assertEquals, assertInstanceOf } from "../../deps.ts";
import { Err, Ok, Result } from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.map", async (t) => {
  await t.step("Result.Ok => Result.Ok", () => {
    const innerValue = "Hello";
    const func = (s: string) => s.length;
    const result = Result.Ok(innerValue).map(func);

    assertInstanceOf(result, Ok<number, unknown>);
    assertEquals(result.unwrap(), func(innerValue));
  });

  await t.step("Result.Err => Result.Err", () => {
    const error = "Error";
    const func = (s: string) => s.length;
    const result = Result.Err<string, string>(error).map(func);

    assertInstanceOf(result, Err<number, string>);
    assertEquals(result.unwrapErr(), error);
  });
});
