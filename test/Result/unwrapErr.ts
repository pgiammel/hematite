import { assertEquals, assertThrows } from "../../deps.ts";
import { Result } from "../../types/result.ts";
import { UnwrapError } from "../../types/error.ts";

Deno.test("Result<T, E>.prototype.unwrapErr", async (t) => {
  await t.step("Ok(data) => throws UnwrapError", () => {
    assertThrows(
      () => Result.Ok("Hello").unwrapErr(),
      UnwrapError,
    );
  });

  await t.step("Err(err) => err", () => {
    const error = "Fail";

    assertEquals(Result.Err(error).unwrapErr(), error);
  });
});
