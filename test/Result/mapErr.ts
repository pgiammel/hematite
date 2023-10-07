import { assertEquals, assertInstanceOf } from "../../deps.ts";
import { Err, Ok, Result } from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.mapErr", async (t) => {
  await t.step("Ok(data) => Ok(data)", () => {
    const innerValue = "Hello";
    const func = (_: number) => true;
    const result = Result.Ok<string, number>(innerValue).mapErr(func);

    assertInstanceOf(result, Ok<string, boolean>);
    assertEquals(result.unwrap(), innerValue);
  });

  await t.step("Err(error), fn => Result.Err(fn(error))", () => {
    const error = -1;
    const func = (_: number) => true;
    const result = Result.Err<unknown, number>(error).mapErr(func);

    assertInstanceOf(result, Err<unknown, boolean>);
    assertEquals(result.unwrapErr(), func(error));
  });
});
