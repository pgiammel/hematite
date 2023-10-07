import { assertEquals } from "../../deps.ts";
import { Result } from "../../types/result.ts";

Deno.test("Result<T, E>.prototype.isOkAnd", async (t) => {
  await t.step("Ok(_), fn <true> => true", () => {
    const func = (_: unknown): boolean => true;
    const result = Result.Ok("Hello").isOkAnd(func);

    assertEquals(result, true);
  });

  await t.step("Ok(_), fn <false> => false", () => {
    const func = (_: unknown): boolean => false;
    const result = Result.Ok("Hello").isOkAnd(func);

    assertEquals(result, false);
  });

  await t.step("Err(_), fn <true> => false", () => {
    const func = (_: unknown): boolean => true;
    const result = Result.Err(-1).isOkAnd(func);

    assertEquals(result, false);
  });

  await t.step("Err(_), fn <false> => false", () => {
    const func = (_: unknown): boolean => false;
    const result = Result.Err(-1).isOkAnd(func);

    assertEquals(result, false);
  });
});
