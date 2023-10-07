import { assertEquals } from "../../deps.ts";
import { Result } from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.isOk", async (t) => {
  await t.step(
    "Ok(_) => true",
    () => assertEquals(Result.Ok("Hello").isOk(), true),
  );

  await t.step(
    "Err(_) => false",
    () => assertEquals(Result.Err("Error").isOk(), false),
  );
});
