import { Err, Ok, Result } from "../../types/result.ts";
import { assertEquals, assertInstanceOf } from "../../deps.ts";

Deno.test("Result<T, E>.prototype.and", async (t) => {
  await t.step("Ok(data), Ok(otherData) => Ok(otherData)", () => {
    const data = "Hello";
    const otherData = 5;
    const result = Result.Ok(data).and(Result.Ok(otherData));

    assertInstanceOf(result, Ok<number, unknown>);
    assertEquals(result.unwrap(), otherData);
  });

  await t.step("Ok(data), Err(otherError) => Err(otherError)", () => {
    const data = "Hello";
    const otherError = false;
    const result = Result.Ok<string, boolean>(data).and(
      Result.Err(otherError),
    );

    assertInstanceOf(result, Err<number, boolean>);
    assertEquals(result.unwrapErr(), otherError);
  });

  await t.step("Err(error), Ok(otherData) => Err(error)", () => {
    const error = false;
    const otherData = 5;
    const result = Result.Err(error).and(Result.Ok(otherData));

    assertInstanceOf(result, Err<number, boolean>);
    assertEquals(result.unwrapErr(), error);
  });

  await t.step("Err(error), Err(otherError) => Err(error)", () => {
    const error = false;
    const otherError = true;
    const result = Result.Err(error).and(Result.Err(otherError));

    assertInstanceOf(result, Err<unknown, boolean>);
    assertEquals(result.unwrapErr(), error);
  });
});
